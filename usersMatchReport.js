const mongoose = require("mongoose");

const aggregation = (userId, pageNumber = null, pageSize = null) => {
    return [
        {
            $match: {
                _id: mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "matchusers",
                localField: "_id",
                foreignField: "userId",
                as: "matchedUsers",
            },
        },
        {
            $addFields: {
                matchUsers: {
                    $map: {
                        input: {
                            $filter: {
                                input: '$matchedUsers',
                                as: 'mu',
                                cond: { $eq: ['$$mu.status', 'MATCHED'] },
                            },
                        },
                        as: 'mu',
                        in: {
                            userAvatar: '$$mu.photoUrl',
                            matchedProfileName: { $concat: ['$$mu.fname', ' ', '$$mu.lname'] },
                            profileType: {
                                $cond: {
                                    if: { $eq: ['$$mu.isPremium', true] },
                                    then: 'PREMIUM',
                                    else: 'NOT PREMIUM',
                                },
                            },
                            status: '$$mu.status',
                            dateOfMatch: '$$mu.statusChangeDate',
                            matchUserId: '$$mu.matchUserId',
                        },
                    },
                },
            },
        },
        {
            $project: {
                matchUsers: 1,
            }
        },
    ]
}

module.exports = aggregation;