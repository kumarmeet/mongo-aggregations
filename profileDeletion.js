const aggregation = (pageNumber, pageSize) => {
    return [
        {
            $match: {
                accountStatus: 'DELETE'
            }
        },
        {
            $sort: { profileDeletionRequest: -1 }
        },
        {
            $skip: (pageNumber - 1) * +pageSize
        },
        {
            $limit: +pageSize
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
                    $ifNull: [
                        { $arrayElemAt: ['$userImage.photoUrl', 0] },
                        'IMG Not Available'
                    ]
                }
            }
        },
        {
            $lookup: {
                from: 'useraccountdeletes',
                let: { userId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$userId', '$$userId'] }
                        }
                    }
                ],
                as: 'deletedUserData'
            }
        },
        {
            $unwind: { path: '$deletedUserData', preserveNullAndEmptyArrays: true }
        },
        {
            $addFields: {
                userReason: {
                    $ifNull: [
                        '$deletedUserData.reasion',
                        'N/A'
                    ]
                }
            }
        },
        {
            $project: {
                userId: '$_id',
                reason: "$userReason",
                requestedOn: '$profileDeletionRequest',
                userAvatar: '$firstUserImage',
                fullName: { $concat: ['$fname', ' ', '$lname'] },
                phoneNumber: 1,
                accountStatus: 1
            }
        }
    ]
}

module.exports = aggregation;