const aggregation = (pageNumber, pageSize) => {
    return [
        {
          '$match': {
            'featuredType': 'PREMIUM',
            'isPremiumPaid': true,
            'paymentStatus': "SUCCESS",
          }
        }, {
          '$project': {
            'period': {
              '$dateToString': {
                'format': format,
                'date': '$date'
              }
            },
            'price': 1,
            'userId': 1,
            featuredType: 1,
            'date': 1
          }
        }, {
          '$lookup': {
            'from': 'users',
            'localField': 'userId',
            'foreignField': '_id',
            'pipeline': [
              {
                '$project': {
                  '_id': 0,
                  'fname': 1,
                  'lname': 1,
                  'isPremium': 1,
                  'phoneNumber': 1,
                  'regDate': 1,
                  'period': 1,
                  'accountStatus': 1,
                  'phoneNumber': 1,
                  // 'date': 1
                }
              }
            ],
            'as': 'user_details'
          }
        }, {
          '$unwind': {
            'path': '$user_details'
          }
        }, {
          '$addFields': {
            'username': {
              '$concat': [
                '$user_details.fname', ' ', '$user_details.lname'
              ]
            }
          }
        }, {
          '$lookup': {
            'from': 'userimgs',
            'localField': 'userId',
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
          '$group': {
            '_id': '$period',
            'count': {
              '$push': {
                'username': '$username',
                'photoUrl': '$photoUrl',
                'isPremium': '$user_details.isPremium',
                'regDate': '$user_details.regDate',
                'accountStatus': '$user_details.accountStatus',
                'period': '$period',
                'price': '$price',
                'purchasedOn': '$date',
                'phoneNumber': '$user_details.phoneNumber',
                'featuredType': '$featuredType'
              }
            }
          }
        }
      ]
}

module.exports = aggregation;
