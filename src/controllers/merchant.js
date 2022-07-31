const { Merchant, MerchantItem, ItemGroup } = require('../models/merchent');

async function getMerchants(req, res) {
  const merchants = await Merchant.find({}, '-__v -createdAt -updatedAt');
  res.status(200).send(merchants);
}

async function getMerchant(req, res) {
  const { id } = req.params
  const merchant = await Merchant.findOne({ _id: id }, '-__v -createdAt -updatedAt');
  const items = await MerchantItem.find({ merchantId: merchant._id }, '-__v -createdAt -updatedAt');
  const groups = await ItemGroup.find({ merchantId: merchant._id }, '-__v -createdAt -updatedAt');
  const itemGroups = []

  for (let i = 0; i < groups.length; ++i) {
    const group = {
      _id: groups[i]._id,
      name: groups[i].name,
      items: []
    }
    for (let j = 0; j < groups[i].itemIds.length; ++j) {
      for (let k = 0; k < items.length; ++k) {
        if (items[k]._id.equals(groups[i].itemIds[j])) {
          group.items.push(items[k])
        }
      }
    }
    itemGroups.push(group)
  }

  merchant._doc.itemGroups = itemGroups

  res.status(200).send(merchant);
}


module.exports = {
  getMerchants,
  getMerchant
}
