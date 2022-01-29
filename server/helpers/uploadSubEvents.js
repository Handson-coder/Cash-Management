const { SubEvent } = require("../models");

const uploadSubEvents = async (obj, next) => {
  let dataEvents = obj.datas;
  let subEvents = [];
  let EventId = 0;
  let dataSubEvents = [];
  try {
    dataEvents.forEach((l) => {
      if (l.SubEvents.length > 0) {
        EventId = l.id;
        l.SubEvents.map((e) => {
          e.EventId = EventId;
        });
        dataSubEvents.push(l.SubEvents);
      }
    });
    dataSubEvents.map((l) => {
      l.forEach((el) => {
        subEvents.push(el);
      });
    });
    subEvents.forEach(async (subEvent) => {
      await SubEvent.create(subEvent);
    });
    return subEvents;
  } catch (err) {
    next(err)
  }
};

module.exports = uploadSubEvents;
