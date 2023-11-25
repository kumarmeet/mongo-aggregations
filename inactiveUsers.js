const aggregation = (pageNumber, pageSize) => {
    return [
        {
            $match: {
                accountStatus: 'INACTIVE'
            }
        },
        {
            $sort: { lastActivityDate: -1 }
        },
        {
            $lookup: {
                from: 'userimgs',
                localField: '_id',
                foreignField: 'userId',
                as: 'userImage'
            }
        },
        {
            $addFields: {
                firstUserImage: {
                    $arrayElemAt: ['$userImage.photoUrl', 0] // Get the first element of the userImages array
                }
            }
        },
        {
            $lookup: {
                from: 'matchusers',
                localField: '_id',
                foreignField: 'userId',
                as: 'matchedUsers'
            }
        },
        {
            $lookup: {
                from: 'cointransactions',
                localField: '_id',
                foreignField: 'userId',
                as: 'totalSpent'
            }
        },
        {
            $addFields: {
                firstUserCoin: {
                    $arrayElemAt: ['$totalSpent.price', -1] // Get the last element of the cointransactions array
                },
                inactiveDays: {
                    $ceil: {
                        $divide: [
                            { $subtract: [new Date(), '$lastActivityDate'] },
                            86400000 // Number of milliseconds in a day (1000 * 60 * 60 * 24)
                        ]
                    }
                }
            }
        },
        {
            $project: {
                userId: '$_id',
                phoneNumber: 1,
                userAvatar: '$firstUserImage',
                fullName: { $concat: ['$fname', ' ', '$lname'] },
                totalSpent: { $ifNull: ['$firstUserCoin', 0] },
                inactiveSince: "$lastActivityDate",
                accountStatus: 1,
                inactiveDays: 1,
                isPremium: 1,
                totalMatches: { $size: { $filter: { input: '$matchedUsers', as: 'mu', cond: { $eq: ['$$mu.status', 'MATCHED'] } } } }
            }
        },
        {
            $skip: (pageNumber - 1) * +pageSize
        },
        {
            $limit: +pageSize
        }
    ]
}

module.exports = aggregation;