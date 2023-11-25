const aggregation = (pageNumber, pageSize) => {
    return [
        {
          $match: {
            featuredType: "PREMIUM",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user_details",
          },
        },
        {
          $lookup: {
            from: "userimgs",
            localField: "userId",
            foreignField: "userId",
            as: "user_image",
          },
        },
        {
          $group: {
            _id: "$userId",
            total_cost: { $sum: "$price" },
            //   user_details: { $first: "$user_details.fname" }
            user_details: { $first: "$user_details" },
            user_image: { $first: "$user_image" },
          },
        },
        { $sort: { total_cost: -1 } },
        {
          $project: {
            _id: 1,
            total_cost: 1,
            fname: { $arrayElemAt: ["$user_details.fname", 0] },
            lname: { $arrayElemAt: ["$user_details.lname", 0] },
            photoUrl: { $arrayElemAt: ["$user_image.photoUrl", 0] },
          },
        },
      ]
}

module.exports = aggregation;
