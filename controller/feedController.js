
exports.getPosts = (req, res, next) => {
    res.status(200).json({
        title: "First Post!",
        description: "This is an awesome post!",
    });
};

exports.createPost = (req, res, next) => {
    const body = req.body;
    console.log(body);
    res.status(201).json({
        id: new Date().toISOString(),
        message: 'Post created successfully!',
    });
};