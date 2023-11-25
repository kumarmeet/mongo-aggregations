const mongoose = require("mongoose");

const aggregation = (pageNumber, pageSize, search) => {
    return [
        {
            $lookup: {
                from: "userimgs",
                localField: "_id",
                foreignField: "userId",
                as: "userImgs",
            },
        },
        {
            $lookup: {
                from: "cointransactions",
                localField: "_id",
                foreignField: "userId",
                as: "cointransactions",
                pipeline: [{ $sort: { date: -1 } }],
            },
        },
        {
            $match: {
                $or: [
                    {
                        "cointransactions.featuredType": {
                            $regex: search,
                            $options: "i",
                        },
                    },
                    { fname: { $regex: search, $options: "i" } },
                    { lname: { $regex: search, $options: "i" } },
                    { phoneNumber: { $regex: search, $options: "i" } },
                ],
            },
        },
        {
            $project: {
                fname: 1,
                lname: 1,
                phoneNumber: 1,
                "userImgs._id": 1,
                "userImgs.userId": 1,
                "userImgs.photoUrl": 1,

                "cointransactions.date": 1,
                "cointransactions.userId": 1,
                "cointransactions._id": 1,
                "cointransactions.coins": 1,
                "cointransactions.price": 1,
            },
        },
        {
            $skip: (pageNumber - 1) * +pageSize
        },
        {
            $limit: +pageSize
        },
    ]
}

const aggregationTwo = (pageNumber, pageSize) => {
    return [
        {
            $lookup: {
                from: "userimgs",
                localField: "_id",
                foreignField: "userId",
                as: "userImgs",
            },
        },
        {
            $lookup: {
                from: "cointransactions",
                localField: "_id",
                foreignField: "userId",
                as: "cointransactions",
                pipeline: [{ $sort: { date: -1 } }],
            },
        },
        {
            $project: {
                fname: 1,
                lname: 1,
                phoneNumber: 1,
                "userImgs._id": 1,
                "userImgs.userId": 1,
                "userImgs.photoUrl": 1,

                "cointransactions.date": 1,
                "cointransactions.userId": 1,
                "cointransactions._id": 1,
                "cointransactions.coins": 1,
                "cointransactions.price": 1,
                'cointransactions.paymentStatus': 1
            },
        },
        {
            $skip: (pageNumber - 1) * +pageSize
        },
        {
            $limit: +pageSize
        },
    ]
}

module.exports = { aggregation, aggregationTwo };