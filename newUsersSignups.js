const aggregation = (pageNumber, pageSize) => {
    return [
          {
            '$addFields': {
              'username': {
                '$concat': [
                  '$fname', ' ', '$lname'
                ]
              }
            }
          }, {
            '$lookup': {
              'from': 'userimgs',
              'localField': '_id',
              'foreignField': 'userId',
              'pipeline': [
                {
                  '$project': {
                    '_id': 0,
                    'photoUrl': 1
                  }
                }
              ],
              'as': 'userImg'
            }
          }, {
            '$set': {
              'photoUrl': {
                '$arrayElemAt': [
                  '$userImg.photoUrl', 0
                ]
              }
            }
          }, {
            '$project': {
              'period': {
                '$dateToString': {
                  'format': formate,
                  'date': '$createdAt'
                }
              },
              'username': 1,
              'photoUrl': 1,
              'isPremium': 1,
              'createdAt': 1,
              'accountStatus': 1,
            }
          }, {
            '$group': {
              '_id': {
                'period': '$period'
              },
              'count': {
                '$push': {
                  'username': '$username',
                  'photoUrl': '$photoUrl',
                  'isPremium': '$isPremium',
                  'regDate': '$createdAt',
                  'accountStatus': '$accountStatus',
                  'period': '$period'

                }
              }
            }
          }
        ]
}

module.exports = aggregation;
