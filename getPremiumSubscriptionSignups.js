const aggregation = (pageNumber, pageSize) => {
    return [
          {
            '$match': {
              'featuredType': 'PREMIUM', 
              'isPremiumPaid': true, 
              'paymentStatus': 'SUCCESS'
            }
          }, {
            '$lookup': {
              'from': 'users', 
              'localField': 'userId', 
              'foreignField': '_id', 
              'pipeline': [
                {
                  '$project': {
                    'lname': 1, 
                    'fname': 1, 
                    'phoneNumber': 1, 
                    'regDate': 1, 
                    'isPremium': 1, 
                    '_id': 0
                  }
                }
              ], 
              'as': 'userdata'
            }
          }, {
            '$lookup': {
              'from': 'userimgs', 
              'localField': 'userId', 
              'foreignField': 'userId', 
              'pipeline': [
                {
                  '$project': {
                    'photoUrl': 1, 
                    '_id': 0
                  }
                }
              ], 
              'as': 'imgs'
            }
          }, {
            '$set': {
              'lname': {
                '$arrayElemAt': [
                  '$userdata.lname', 0
                ]
              }, 
              'phoneNumber': {
                '$arrayElemAt': [
                  '$userdata.phoneNumber', 0
                ]
              }, 
              'fname': {
                '$arrayElemAt': [
                  '$userdata.fname', 0
                ]
              }, 
              'signUpDate': {
                '$arrayElemAt': [
                  '$userdata.regDate', 0
                ]
              }, 
              'premium': {
                '$arrayElemAt': [
                  '$userdata.isPremium', 0
                ]
              }
            }
          }, {
            '$addFields': {
              'userName': {
                '$concat': [
                  '$fname', ' ', '$lname'
                ]
              }
            }
          }, {
            '$set': {
              'userAvatar': {
                '$arrayElemAt': [
                  '$imgs.photoUrl', 0
                ]
              }, 
              'validateUpto': '$expireDate', 
              'purchaseDate': '$date'
            }
          }, {
            '$project': {
              'userId': 1, 
              'featuredType': 1, 
              'userAvatar': 1, 
              'expireDate': 1, 
              'premium': 1, 
              'signUpDate': 1, 
              'validateUpto': 1, 
              'purchaseDate': 1, 
              'userName': 1,
              'phoneNumber': 1,
            }
          }
        ]
}

module.exports = aggregation;
