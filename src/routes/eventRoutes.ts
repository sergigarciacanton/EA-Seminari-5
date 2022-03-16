import { Request, response, Response, Router } from "express";

import Event from "../models/Event";
import User from "../models/User";

class EventRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.routes(); //This has to be written here so that the method can actually be configured when called externally.
  }

  public async getEvents(req: Request, res: Response): Promise<void> {
    //It returns a void, but internally it's a promise.
    const allEvents = await Event.find();
    if (allEvents.length == 0) {
      res.status(404).send("There are no events yet!");
    } else {
      res.status(200).send(allEvents);
    }
  }

  public async getEventByUserName(req: Request, res: Response): Promise<void> {
    const userFound = await User.findOne({
      name: req.params.nameUser,
    }).populate("events");
    if (userFound == null) {
      res.status(404).send("The user doesn't exist!");
    } else {
      res.status(200).send(userFound);
    }
  }

  public async addEventToUser(req: Request, res: Response): Promise<void> {
    console.log(req.body);
    const { id, name, admin, category } = req.body;
    const userFound = await User.findOne({
      name: req.params.nameUser,
    }).populate("events");
    const newEvent = new Event({ id, name, admin, category });
    await userFound.events.push(newEvent);
    await userFound.save();
    res.status(200).send("Event added!");
  }

  public async updateEvent(req: Request, res: Response): Promise<void> {
    const eventToUpdate = await Event.findOneAndUpdate(
      { name: req.params.nameEvent },
      req.body
    );
    if (eventToUpdate == null) {
      res.status(404).send("The event doesn't exist!");
    } else {
      res.status(200).send("Updated!");
    }
  }

  public async deleteEvent(req: Request, res: Response): Promise<void> {
    const eventToDelete = await Event.findOneAndDelete(
      { name: req.params.nameUser },
      req.body
    );
    if (eventToDelete == null) {
      res.status(404).send("The event doesn't exist!");
    } else {
      res.status(200).send("Deleted!");
    }
  }
  routes() {
    this.router.get("/", this.getEvents);
    this.router.get("/:nameUser", this.getEventByUserName);
    this.router.post("/:nameUser", this.addEventToUser);
    this.router.put("/:nameEvent", this.updateEvent);
    this.router.delete("/:nameEvent", this.deleteEvent);
  }
}
const eventRoutes = new EventRoutes();

export default eventRoutes.router;
