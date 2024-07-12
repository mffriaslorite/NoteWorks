require('dotenv').config();

const config = require('./config.json');
const mongoose = require('mongoose');

mongoose.connect(config.connectionString);

const User = require('./models/user.model');
const Folder = require('./models/folder.model');
const Note = require('./models/note.model');


const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);


app.get('/', (req, res) => {
    res.json({data: "hello"});
});

//*** Auth API's ***//
//Create account
app.post("/api/v1/signup", async (req, res) => {

    const { fullName, email, password } = req.body;

    if(!fullName) {
        return res.status(400).json({ error: true, message: "Full Name is required" });
    }

    if(!email) {
        return res.status(400).json({ error: true, message: "Email is required" });
    }

    if(!password) {
        return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser){
        return res.json({
            error: true,
            message: "User already exists"
        });
    }

    const user = new User({
        fullName,
        email,
        password
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration successfully",
    });

});

//Login
app.post("/api/v1/login", async (req, res) => {

    const { email, password } = req.body;

    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if(!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if(!userInfo){
        return res.status(400).json({ message: "User not found" });
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            user,
            accessToken,
            message: "Login successfully",
        });
    }
    else{
        return res.status(400).json({ 
            error: true, 
            message: "Invalid Credentials" 
        });
    }

});

//Get User
app.get("/api/v1/users", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user.user._id });

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "User fetched successfully",
    });
});


//*** Folders API's ***//
//Add folder
app.post("/api/v1/folders", authenticateToken, async (req, res) => {
    const { title, comment } = req.body;
    const { user } = req.user;

    if(!title) {
        return res.status(400).json({ error:true, message: "Title is required" });
    }

    try{
        const folder = new Folder({
            title,
            comment: comment || "",
            userId: user.user._id,
        });
        
        await folder.save();

        return res.json({
            error: false,
            folder,
            message: "Folder added successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Edit folder
app.put("/api/v1/folders/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { title, comment } = req.body;
    const { user } = req.user;

    if(!title && !comment) {
        return res.status(400).json({ error:true, message: "No changes provided" });
    }

    try{
        const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });

        if(!folder){
            return res.status(404).json({ error:true, message: "Folder not found" });
        }

        if(title) folder.title = title;
        if(comment) folder.comment = comment;
        
        await folder.save();

        return res.json({
            error: false,
            folder,
            message: "Folder updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Get All Folders
app.get("/api/v1/folders", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try{
        const folders = await Folder.find({ userId: user.user._id });

        return res.json({
            error: false,
            folders,
            message: "All folders fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Delete Folder
app.delete("/api/v1/folders/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { user } = req.user;

    try{
        const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });

        if(!folder){
            return res.status(404).json({ error:true, message: "Folder not found" });
        }

        await folder.deleteOne({ _id: folderId, userId: user.user._id });

        return res.json({
            error: false,
            message: "Folder deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});


//*** Notes API's ***//
//Add note
app.post("/api/v1/folders/:folderId/notes", authenticateToken, async (req, res) => {
    const { title, content, keywords } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    if(!title) {
        return res.status(400).json({ error:true, message: "Title is required" });
    }

    if(!content) {
        return res.status(400).json({ error:true, message: "Content is required" });
    }

    const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });
    if(!folder){
        return res.status(404).json({ error:true, message: "Folder not found" });
    }

    try{
        const note = new Note({
            title,
            content,
            keywords: keywords || [],
            userId: user.user._id,
            folderId: folderId,
        });
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
    
});

//Edit note
app.put("/api/v1/folders/:folderId/notes/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, keywords, isPinned } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    if(!title && !content && !keywords) {
        return res.status(400).json({ error:true, message: "No changes provided" });
    }

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(keywords) note.keywords = keywords;
        if(isPinned) note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Get All Notes
app.get("/api/v1/folders/:folderId/notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const notes = await Note.find({ folderId, userId: user.user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Delete Note
app.delete("/api/v1/folders/:folderId/notes/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        await note.deleteOne({ _id: noteId, userId: user.user._id, folderId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Pin Notes
app.put("/api/v1/folders/:folderId/notes/:noteId/pinned", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note pinned successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Search Notes
app.get("/api/v1/folders/:folderId/notes/search", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const folderId = req.params.folderId;
    const { query } = req.query;

    if(!query) {
        return res.status(400).json({ error:true, message: "Search query is required" });
    }

    try{
        const matchingNotes = await Note.find({
            userId: user.user._id,
            folderId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
                { keywords: { $in: [query] } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }

});

//Login
app.post("/api/v1/login", async (req, res) => {

    const { email, password } = req.body;

    if(!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if(!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });

    if(!userInfo){
        return res.status(400).json({ message: "User not found" });
    }

    if(userInfo.email == email && userInfo.password == password){
        const user = {user: userInfo};

        const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });

        return res.json({
            error: false,
            user,
            accessToken,
            message: "Login successfully",
        });
    }
    else{
        return res.status(400).json({ 
            error: true, 
            message: "Invalid Credentials" 
        });
    }

});

//Get User
app.get("/api/v1/users", authenticateToken, async (req, res) => {
    const { user } = req.user;

    const isUser = await User.findOne({ _id: user.user._id });

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName, 
            email: isUser.email,
            "_id": isUser._id,
            createdOn: isUser.createdOn
        },
        message: "User fetched successfully",
    });
});


//*** Folders API's ***//
//Add folder
app.post("/api/v1/folders", authenticateToken, async (req, res) => {
    const { title, comment } = req.body;
    const { user } = req.user;

    if(!title) {
        return res.status(400).json({ error:true, message: "Title is required" });
    }

    try{
        const folder = new Folder({
            title,
            comment: comment || "",
            userId: user.user._id,
        });
        
        await folder.save();

        return res.json({
            error: false,
            folder,
            message: "Folder added successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Edit folder
app.put("/api/v1/folders/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { title, comment } = req.body;
    const { user } = req.user;

    if(!title && !comment) {
        return res.status(400).json({ error:true, message: "No changes provided" });
    }

    try{
        const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });

        if(!folder){
            return res.status(404).json({ error:true, message: "Folder not found" });
        }

        if(title) folder.title = title;
        if(comment) folder.comment = comment;
        
        await folder.save();

        return res.json({
            error: false,
            folder,
            message: "Folder updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Get All Folders
app.get("/api/v1/folders", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try{
        const folders = await Folder.find({ userId: user.user._id });

        return res.json({
            error: false,
            folders,
            message: "All folders fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Delete Folder
app.delete("/api/v1/folders/:folderId", authenticateToken, async (req, res) => {
    const folderId = req.params.folderId;
    const { user } = req.user;

    try{
        const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });

        if(!folder){
            return res.status(404).json({ error:true, message: "Folder not found" });
        }

        await folder.deleteOne({ _id: folderId, userId: user.user._id });

        return res.json({
            error: false,
            message: "Folder deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});


//*** Notes API's ***//
//Add note
app.post("/api/v1/folders/:folderId/notes", authenticateToken, async (req, res) => {
    const { title, content, keywords } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    if(!title) {
        return res.status(400).json({ error:true, message: "Title is required" });
    }

    if(!content) {
        return res.status(400).json({ error:true, message: "Content is required" });
    }

    const folder = await Folder.findOne({ _id: folderId, userId: user.user._id });
    if(!folder){
        return res.status(404).json({ error:true, message: "Folder not found" });
    }

    try{
        const note = new Note({
            title,
            content,
            keywords: keywords || [],
            userId: user.user._id,
            folderId: folderId,
        });
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
    
});

//Edit note
app.put("/api/v1/folders/:folderId/notes/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, keywords, isPinned } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    if(!title && !content && !keywords) {
        return res.status(400).json({ error:true, message: "No changes provided" });
    }

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        if(title) note.title = title;
        if(content) note.content = content;
        if(keywords) note.keywords = keywords;
        if(isPinned) note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Get All Notes
app.get("/api/v1/folders/:folderId/notes", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const notes = await Note.find({ folderId, userId: user.user._id }).sort({ isPinned: -1 });

        return res.json({
            error: false,
            notes,
            message: "All notes fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Delete Note
app.delete("/api/v1/folders/:folderId/notes/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        await note.deleteOne({ _id: noteId, userId: user.user._id, folderId });

        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Pin Notes
app.put("/api/v1/folders/:folderId/notes/:noteId/pinned", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;
    const folderId = req.params.folderId;

    try{
        const note = await Note.findOne({ _id: noteId, userId: user.user._id, folderId });

        if(!note){
            return res.status(404).json({ error:true, message: "Note not found" });
        }

        note.isPinned = isPinned;
        
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note pinned successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }
});

//Search Notes
app.get("/api/v1/folders/:folderId/notes/search", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const folderId = req.params.folderId;
    const { query } = req.query;

    if(!query) {
        return res.status(400).json({ error:true, message: "Search query is required" });
    }

    try{
        const matchingNotes = await Note.find({
            userId: user.user._id,
            folderId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
                { keywords: { $regex: new RegExp(query, "i") } },
            ],
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes fetched successfully",
        });
    }
    catch(error){
        return res.status(500).json({ error:true, message: "Internal Server Error" });
    }

});

const summaryRoutes = require('./routes/summary');
app.use('/api/v1', summaryRoutes);

app.listen(8000);

module.exports = app;

