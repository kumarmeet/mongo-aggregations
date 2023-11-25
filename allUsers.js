const aggregation = (pageNumber, pageSize) => {
    return [
        {
            $sort: { regDate: -1 }
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
                lastActivityDate: 1,
                regDate: 1,
                accountStatus: 1,
                isPremium: 1,
                isSuperAdmin: 1,
                matchCount: { $size: { $filter: { input: '$matchedUsers', as: 'mu', cond: { $eq: ['$$mu.status', 'MATCHED'] } } } }
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