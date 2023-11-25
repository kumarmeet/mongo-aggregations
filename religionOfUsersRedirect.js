const aggregation = (pageNumber, pageSize) => {
    return [
        {
          $match: {
            religion: { $exists: true },
            regDate: {
              $gte: new Date(mindate),
              $lte: new Date(maxdate),
            },
            religion: religion
          },
        }, {
          $addFields: {
            'username': {
              $concat: [
                '$fname', ' ', '$lname'
              ]
            }
          }
        }, {
          $lookup: {
            'from': 'userimgs',
            'localField': '_id',
            'foreignField': 'userId',
            'pipeline': [
              {
                $project: {
                  '_id': 0,
                  'photoUrl': 1
                }
              }
            ],
            'as': 'userImg'
          }
        },
        {
          $set: {
            'photoUrl': {
              '$arrayElemAt': [
                '$userImg.photoUrl', 0
              ]
            }
          }
        }, {
          $project: {
            'userImg': 0
          }
        }, {
          $project: {
            'gender ': 1,
            'userImg': 1,
            'phoneNumber': 1,
            'isPremium': 1,
            'username': 1,
            'photoUrl': 1,
            'religion': 1
          }
        }
      ]
}

module.exports = aggregation;
