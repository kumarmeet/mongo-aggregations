const aggregation = (pageNumber, pageSize) => {
    return [
        {
            $match: { isPremium: true }
        },
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
                    $arrayElemAt: ['$userImage.photoUrl', 0]
                }
            }
        },
        {
            $lookup: {
                from: 'cointransactions',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$userId', '$$userId'] },
                                    { $eq: ['$featuredType', 'PREMIUM'] },
                                    { $eq: ['$isPremiumPaid', true] }
                                ]
                            }
                        }
                    },
                    {
                        $sort: { createdAt: -1 }
                    },
                    {
                        $limit: 1
                    }
                ],
                as: 'totalSpent'
            }
        },
        {
            $addFields: {
                firstUserCoin: {
                    $arrayElemAt: ['$totalSpent.price', 0]
                },
                purchaseDate: {
                    $ifNull: [
                        { $arrayElemAt: ['$totalSpent.date', 0] },
                        null
                    ]
                }
            }
        },
        {
            $project: {
                userId: '$_id',
                userAvatar: '$firstUserImage',
                phoneNumber: 1,
                fullName: { $concat: ['$fname', ' ', '$lname'] },
                isPremium: 1,
                amountSpent: { $ifNull: ['$firstUserCoin', 0] },
                purchaseDate: 1,
                expireDate: "$premiumExpire",
                accountStatus: 1,
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