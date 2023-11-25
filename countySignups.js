const aggregation = (pageNumber, pageSize) => {
    return[
        {
          $match: {
            regDate: {
              $gte: new Date(mindate),
              $lte: new Date(maxdate),
            },
            country: country
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
            'country': 1,
            'userImg': 1,
            'phoneNumber': 1,
            'isPremium': 1,
            'username': 1,
            'photoUrl': 1,
            // 'userImg': 0
          }
        }
      ]
}

module.exports = aggregation;
