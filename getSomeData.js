const aggregation = (pageNumber, pageSize) => {
    return [
      {
        '$match': {
          'type': 'CREDIT',
          'paymentStatus': {
            '$exists': true
          },
          'date': {
            '$gte': startOfYear,
            '$lte': endOfYear
          }
        }
      },
      {
        '$project': {
          'period': {
            '$dateToString': {
              'format': '%Y-%m',
              'date': '$date'
            }
          },
          'price': 1,
          'paymentStatus': 1
        }
      },
      {
        '$group': {
          '_id': {
            'period': '$period',
            'paymentStatus': '$paymentStatus'
          },
          'totalPrice': {
            '$sum': '$price'
          }
        }
      },
      {
        '$group': {
          '_id': '$_id.period',
          'data': {
            '$push': {
              'paymentStatus': '$_id.paymentStatus',
              'totalPrice': '$totalPrice'
            }
          }
        }
      },
      {
        '$unwind': '$data' // Unwind the data array to get separate documents for each paymentStatus
      },
      {
        '$group': {
          '_id': '$_id',
          'successTotal': {
            '$sum': {
              '$cond': [
                {
                  '$eq': ['$data.paymentStatus', 'SUCCESS']
                },
                '$data.totalPrice',
                0
              ]
            }
          },
          'failTotal': {
            '$sum': {
              '$cond': [
                {
                  '$eq': ['$data.paymentStatus', 'FAILED']
                },
                '$data.totalPrice',
                0
              ]
            }
          }
        }
      },
      {
        '$sort': {
          '_id': 1
        }
      },
      {
        '$limit': 12
      }
    ]
}

module.exports = aggregation;
