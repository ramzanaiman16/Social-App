const User = require("../models/Users")
const Post = require("../models/Post");
const { trace } = require("../routes/user");
exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: " User already exists" })
        }
        user = await User.create({ name, email, password, avatar: { public_id: "Sample_id", url: "sample_url" } })

        const token = await user.generateToken()
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
            httpOnly: true,

        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token,
        })
    }


    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body

        const user = await User.findOne({ email }).select("+password")
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "InCorrect Password"
            })
        }


        const token = await user.generateToken()
        const options = {
            expires: new Date(Date.now() + 90 * 24 * 60 * 1000),
            httpOnly: true,

        }

        res.status(201).cookie("token", token, options).json({
            success: true,
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

exports.logOut = async (req, res) => {
    try {
        res
            .status(200)
            .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
            .json({
                success: true,
                message: "Logged Out"
            });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


exports.followUser = async (req, res) => {

    try {

        const userToFollow = await User.findById(req.params.id)
        const loggedInUser = await User.findById(req.user._id)

        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User not Found"
            })
        }


        if (loggedInUser.following.includes(userToFollow._id)) {

            const indexFollowing = loggedInUser.following.indexOf(userToFollow._id)
            loggedInUser.following.splice(indexFollowing, 1)



            const indexFollowers = userToFollow.followers.indexOf(loggedInUser._id)
            userToFollow.followers.splice(indexFollowers, 1)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(200).json({
                success: true,
                message: "User UnFollowed"
            })
        } else {
            loggedInUser.following.push(userToFollow._id)
            userToFollow.followers.push(loggedInUser._id)

            await loggedInUser.save()
            await userToFollow.save()

            res.status(200).json({
                success: true,
                message: "User Followed"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.updatePassword = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("+password")
        const { oldPassword, newPassword } = req.body

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: " Please Provide old and new Password"
            })
        }
        const isMatch = await user.matchPassword(oldPassword)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: " InCorrect Old Password"
            })
        }

        user.password = newPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password Updated"
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



exports.updateProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user._id)
        const { name, email } = req.body

        if (name) {
            user.name = name
        }

        if (email) {
            user.email = email
        }

        await user.save()
        res.status(200).json({
            success: true,
            message: "Profile Updated"
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const posts = user.posts;
        const followers = user.followers
        const userId = user._id
        const following = user.following

        // Delete the user
        await User.deleteOne({ _id: user._id });

        // Remove the user's authentication token
        res.cookie("token", null, { expires: new Date(0), httpOnly: true });

        // Delete the user's posts
        for (let i = 0; i < posts.length; i++) {
            const post = await Post.findById(posts[i]);
            await post.remove();
        }

        for (let i = 0; i < followers.length; i++) {
            const follower = await User.findById(followers[i]);

            const index = follower.following.indexOf(userId)
            follower.following.splice(index, 1)
            await follower.save()
        }



        for (let i = 0; i < following.length; i++) {
            const follows = await User.findById(following[i]);
            const index = follows.followers.indexOf(userId)
            follows.followers.splice(index, 1)
            await follows.save()
        }


        res.status(200).json({
            success: true,
            message: "Profile Deleted"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



exports.myProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).populate("posts")

        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.params.id).populate("posts")

        if(!user){
            return res.status(404).json({
                success : false,
                message : "User not found"
            })
        }


        res.status(200).json({
            success: true,
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}



exports.getAllUsers = async(req, res)=>{
    try {
        
        const users = await User.find({})
        res.status(200).json({
            success : true,
            users,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


exports.getMyPosts = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const posts = [];
  
      for (let i = 0; i < user.posts.length; i++) {
        const post = await Post.findById(user.posts[i]).populate(
          "likes comments.user owner"
        );
        posts.push(post);
      }
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  
  exports.getUserPosts = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
  
      const posts = [];
  
      for (let i = 0; i < user.posts.length; i++) {
        const post = await Post.findById(user.posts[i]).populate(
          "likes comments.user owner"
        );
        posts.push(post);
      }
  
      res.status(200).json({
        success: true,
        posts,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  