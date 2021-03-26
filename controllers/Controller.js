module.exports = class Controller {
  constructor(model) {
    this.model = model;
  }

  async getAllEntities(req, res, next) {
    try {
      const items = await this.model.find({});
      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

  async getEntityById(req, res, next) {
    try {
      const item = await this.model.findById(req.params.id);
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  async createEntity(req, res, next) {
    try {
      const createdItem = await this.model.create(req.body);
      res.status(201).json(createdItem);
    } catch (err) {
      next(err);
    }
  }

  async updateEntityById(req, res, next) {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          useFindAndModify: false,
        }
      );
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      next(err);
    }
  }

  async deleteEntityById(req, res, next) {
    try {
      const deletedItem = await this.model.findByIdAndDelete(req.params.id);

      if (deletedItem) {
        res.status(200).json(deletedItem);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (err) {
      next(err);
    }
  }
};
