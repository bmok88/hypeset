/**
 * Created by chrisng on 3/12/17.
 */
import m from '../../models';

async function getOwnBrands(req, res) {
  try {
    const query = {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
      where: { id: req.user.id },
      include: [{
        model: m.Brand,
        attributes: ['name'],
        order: [[m.sequelize.fn('lower', m.sequelize.col('name')), 'ASC']],
      }],
    };
    const user = await m.User.find(query);
    res.status(200).send({ success: true, brands: user.Brands });
  } catch(err) {
    console.error(`Error retrieving brands for user ${req.user.id}: ${JSON.stringify(err)}`);
    res.status(500).send({ success: false, message: JSON.stringify(err) });
  }
}

async function updateOwnBrands(req, res) {
  const { brands } = req.body;
  try {
    const user = await m.User.findById(req.user.id);
    const successfulInserts = [];
    const failedInserts = [];
    for (let i = 0; i < brands.length; i++) {
      const brand = await m.Brand.findByName(brands[i]);
      if (brand) {
        user.addBrand(brand);
        successfulInserts.push(brand);
      } else {
        failedInserts.push(brands[i]);
      }
    }
    if (!successfulInserts.length) {
      return res.status(400).send({ success: false, failedInserts });
    }
    res.status(200).send({ success: true, successfulInserts, failedInserts });
  } catch(err) {
    console.error(`Error updating brands for user ${req.user.id}: ${JSON.stringify(err)}`);
    res.status(500).send({ success: false, message: JSON.stringify(err) });
  }
}

async function deleteOwnBrands(req, res) {
  const { brands } = req.body;
  try {
    const user = await m.User.findById(req.user.id);
    const successfulDeletes = [];
    const failedDeletes = [];
    for (let i = 0; i < brands.length; i++) {
      const brand = await m.Brand.findByName(brands[i]);
      const hasAssociation = await user.hasBrand(brand);
      if (brand && hasAssociation) {
        user.removeBrand(brand);
        successfulDeletes.push(brands[i]);
      } else {
        failedDeletes.push(brands[i]);
      }
    }
    if (!successfulDeletes.length) {
      return res.status(400).send({ success: false, failedDeletes });
    }
    res.status(200).send({ success: true, successfulDeletes, failedDeletes });
  } catch(err) {
    console.error(`Error deleting brands for user ${req.user.id}: ${JSON.stringify(err)}`);
    res.status(500).send({ success: false, message: JSON.stringify(err) });
  }
}

module.exports = { getOwnBrands, updateOwnBrands, deleteOwnBrands };
