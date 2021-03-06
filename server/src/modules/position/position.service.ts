import { Brackets, getManager, getRepository } from "typeorm";
import { HttpException } from "../../helpers/errors/http.exception";
import { Candidate } from "../candidate/entity/candidate.entity";
import { Position } from "./entity/position.entity";
import {
  CreatePositionBody,
  GetPositionBody,
  UpdatePositionBody,
  UpdatePositionDisplayOrder,
} from "./position.interface";

const getAll = async (_electionId: number, _query: GetPositionBody) => {
  const positionRepository = getRepository(Position);
  const searchStirng = _query.search ? _query.search : "";

  if (!_electionId)
    throw new HttpException("BAD_REQUEST", "Election id is required");

  let builder = positionRepository
    .createQueryBuilder("position")
    .where("position.election_id = :electionId", {
      electionId: _electionId,
    });

  if (searchStirng) {
    builder = builder.andWhere(
      new Brackets((sqb) => {
        sqb.orWhere("position.title ILIKE :title", {
          title: `%${searchStirng}%`,
        });
      })
    );
  }

  builder = builder.orderBy({
    "position.display_order": _query.order || "ASC",
    "position.created_at": "DESC",
  });

  if (_query.page && _query.take) {
    const offset = _query.page * _query.take - _query.take;
    builder = builder.offset(offset).limit(_query.take);
  }

  const [items, count] = await builder.getManyAndCount();

  return {
    items,
    totalCount: count,
    itemsCount: items.length,
  };
};

const getById = async (_id: string) => {
  if (!_id) throw new HttpException("BAD_REQUEST", "Position ID is required");

  const position = await Position.findOne(_id, {
    relations: ["candidates"],
  });

  console.log(position);

  return position || null;
};

const create = async (_position: CreatePositionBody) => {
  if (!_position.election_id)
    throw new HttpException("BAD_REQUEST", "Election is required");

  const position = Position.create({
    election_id: _position.election_id,
    title: _position.title,
    description: _position.description,
    min_selected: _position.min_selected,
    max_selected: _position.max_selected,
  });

  const savedPosition = await position.save();

  console.log(savedPosition);

  return position;
};

const update = async (_position: UpdatePositionBody) => {
  if (!_position.id) {
    throw new HttpException("BAD_REQUEST", "Position ID is required");
  }

  const curPosition = await Position.findOne(_position.id);

  if (!curPosition) {
    throw new HttpException("NOT_FOUND", "Position not found");
  }

  const toUpdatePosition = Position.merge(curPosition, {
    election_id: _position.election_id,
    title: _position.title,
    description: _position.description,
    min_selected: _position.min_selected,
    max_selected: _position.max_selected,
  });

  await Position.update(_position.id, toUpdatePosition);
  return true;
};

const updateDisplayOrder = async (_position: UpdatePositionDisplayOrder) => {
  let dataValues = [];

  if (!_position.election_id) {
    throw new HttpException("BAD_REQUEST", "Election is required");
  }

  if (!_position.displayOrder.length) {
    throw new HttpException("BAD_REQUEST", "Display Orders is empty");
  }

  const entityManager = getManager();

  _position.displayOrder.forEach((item) => {
    dataValues.push(`(${item.id}, ${item.order})`);
  });

  console.log("Datavalues", dataValues);

  const rawQuery = await entityManager.query(`
    UPDATE 
      position AS position
    SET
      display_order = data.col_display_order
    FROM 
      (values ${dataValues.join(",")}) 
    AS 
      data(col_id, col_display_order) 
    WHERE 
      position.id = data.col_id 
    AND 
      election_id = ${_position.election_id}; 
  `);

  console.log("Raw Query Result", rawQuery);

  return true;
};

const remove = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Position id is required");
  }

  const position = await Position.findOne(_id);

  const candidates = await Candidate.find({
    where: {
      position_id: _id,
    },
    select: ["id"],
  });

  if (candidates.length) {
    throw new HttpException(
      "BAD_REQUEST",
      "You cannot delete this, because some candidates depends on it"
    );
  }

  if (!position) {
    throw new HttpException("NOT_FOUND", "Position not found");
  }

  // Soft remove only so that we can restore it
  await position.softRemove();

  return true;
};

const restore = async (_id: string) => {
  if (!_id) {
    throw new HttpException("BAD_REQUEST", "Position id is required");
  }

  const position = await Position.findOne(_id, {
    withDeleted: true,
  });

  if (!position) {
    throw new HttpException("NOT_FOUND", "Position not found");
  }

  await position.recover();
  return true;
};

const positionServices = {
  getAll,
  getById,
  create,
  update,
  remove,
  restore,
  updateDisplayOrder,
};

export default positionServices;
