const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product}],
    });
    res.status(200).json(tagData);
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product}],
    });
    if (!tagData) {
      res.status(400).json({'message': 'No tag found with that id.'});
    } else {
      res.status(200).json(tagData);
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const newTag = await Tag.create(req.body);
    if (req.body.productIds.length) {
      const tagProductIdArr = req.body.productIds.map((product_id) => {
        return {
          tag_id: newTag.id,
          product_id,
        };
      });
      const tagProductIds = await ProductTag.bulkCreate(tagProductIdArr);
      res.status(200).json(tagProductIds);
    } else {
      res.status(200).json(newTag);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!updateTag) {
      res.status(400).json({'message': 'No tag found with that id.'});
    } else {
      res.status(200).json([{'message': 'Tag updated.'}, {id: updateTag.id, tag_name: updateTag.tag_name}]);
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedTag = await Tag.findByPk(req.params.id);
    await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!deletedTag) {
      res.status(400).json({'message': 'No tag found with that id.'});
    } else {
      res.status(200).json([{'message': 'Tag deleted.'}, {id: deletedTag.id, tag_name: deletedTag.tag_name}]);
    }
  }
  catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;