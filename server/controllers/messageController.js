import axios from "axios"
import Chat from "../models/Chat.js"
import User from "../models/User.js"
import imagekit from "../configs/imagekit.js";
import openai from "../configs/openai.js"
// import { response } from "express";



//  Text based Ai Chat  Message Controller


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id;

        //  Check Credits

        if (req.user.credit < 1) {
            return res.json({
                success: false,
                message: "You don't have enough credits to use this feature"
            });
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId });

        if (!chat) {
          return res.json({
            success:false,
            message:"Chat not found"
          })
        }

        chat.messages.push({ role: "user", content: prompt, timeStamp: Date.now(), image: false })


        //  These comes from the docs


        const { choices } = await openai.chat.completions.create({
            model: "gemini-3-flash-preview",
            messages: [
                {
                    "role": "user",
                    "content": prompt,
                }
            ]
        })

        //  It is the last line of code from the docs
        const reply = { ...choices[0].message, timeStamp: Date.now(), image: false };

        chat.messages.push(reply);
        await chat.save();

        // await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
        // res.json({ success: true, reply });

        // req.user.credits -= 1
        // await req.user.save()


        await User.updateOne(
            { _id: userId },
            { $inc: { credit: -1 } }
        );

        const updatedUser = await User.findById(userId);

        res.json({
            success: true,
            reply,
            credit: updatedUser.credit
        });

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}




// export const textMessageController = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const { chatId, prompt } = req.body;

//         if (req.user.credits < 1) {
//             return res.json({
//                 success: false,
//                 message: "Not enough credits"
//             });
//         }

//         const chat = await Chat.findOne({ userId, _id: chatId });

//         if (!chat) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Chat not found"
//             });
//         }

//         chat.messages.push({
//             role: "user",
//             content: prompt,
//             timeStamp: Date.now(),
//             image: false
//         });

//         const completion = await openai.chat.completions.create({
//             model: "gpt-4o-mini",
//             messages: [{ role: "user", content: prompt }]
//         });

//         const reply = {
//             ...completion.choices[0].message,
//             timeStamp: Date.now(),
//             image: false
//         };

//         chat.messages.push(reply);

//         await chat.save();

//         await User.updateOne(
//             { _id: userId },
//             { $inc: { credits: -1 } }
//         );

//         res.json({ success: true, reply });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };




// Image Generation Message Controller 

export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id;
        //  Check Credits

        if (req.user.credit < 2) {
            return res.json({
                success: false,
                message: "You don't have enough creditsto use this feature"
            });
        }
        const { prompt, chatId, isPublished } = req.body;
        // Find chat

        const chat = await Chat.findOne({ userId, _id: chatId });

        // Push user message


        chat.messages.push({
            role: "user",
            content: prompt,
            timeStamp: Date.now(),
            image: false,
        })

        // Encode the prompt 

        const encodedPrompt = encodeURIComponent(prompt);


        // Construct Imagekit AI Generation URL

        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt/${Date.now()}.png?tr=w-800,h-800`;

        // Trigger generation by fetching from Imagekit.

        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" });

        // Conver to Base64 

        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;


        // Upload to Imagekit Media Library.

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "quickgpt"
        });

        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timeStamp: Date.now(),
            image: true,
            isPublished
        };
        // res.json({ success: true, reply });

        chat.messages.push(reply)
        await chat.save();

        // await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })
        // req.user.credits -= 2
        // await req.user.save()

        await User.updateOne(
            { _id: userId },
            { $inc: { credit: -2 } }
          );
          
          const updatedUser = await User.findById(userId);
          
          res.json({
            success: true,
            reply,
            credit: updatedUser.credit
          });

        // }
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}