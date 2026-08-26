import express, { Request, Response, Router } from "express";
import UsersController from "./controllers/usersController";
import BarbersController from "./controllers/barbersController";
import ServicesController from "./controllers/servicesController";
import AppointmentsController from "./controllers/appointmentController";
import BarberScheduleController from "./controllers/barberScheduleController";
import AuthController from "./controllers/authController";
import authMiddleware from "./middlewares/authMiddleware";
import requirePermission from "./middlewares/permissionMiddleware";

const app = express();
app.use(express.json());

const cors = require("cors");

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:8080",
    "https://cortaai.local",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

const corsOptions = {

    origin: ( origin: string | undefined, callback: ( error: Error | null, allow?: boolean ) => void ) => {
        if ( !origin || allowedOrigins.includes(origin) ) { callback(null, true); return; }
        callback( new Error( "Origem nao permitida pelo CORS" ) );
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS" ],
    allowedHeaders: [ "Content-Type", "Authorization" ],
    credentials: false
};


app.use(cors(corsOptions));
app.options( /.*/, cors(corsOptions) );

const router: Router = Router();

router.post("/login", AuthController.login);

router.get( "/users", authMiddleware, UsersController.list );
router.post( "/users", UsersController.create);
router.get( "/users/:id", authMiddleware, UsersController.getById );
router.put( "/users/:id", authMiddleware, UsersController.update);
router.delete( "/users/:id", authMiddleware, UsersController.remove );

router.get( "/barbers/profile", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.getProfile );
router.put( "/barbers/profile", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.updateProfile );
router.get( "/barbers", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.list );
router.post( "/barbers", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.create);
router.get( "/barbers/:id", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.getById );
router.delete( "/barbers/:id", authMiddleware, requirePermission( "barber_profile.access" ), BarbersController.remove );

router.get( "/services", ServicesController.list);
router.post( "/services", authMiddleware, requirePermission( "services.access" ), ServicesController.create );
router.get( "/services/:id", ServicesController.getById );
router.put( "/services/:id", authMiddleware, requirePermission( "services.access" ), ServicesController.update );
router.delete("/services/:id", authMiddleware, requirePermission( "services.access" ), ServicesController.remove );

router.get( "/appointments", authMiddleware, AppointmentsController.list );
router.post( "/appointments", authMiddleware, AppointmentsController.create );
router.get( "/appointments/:id", authMiddleware, AppointmentsController.getById );
router.put( "/appointments/:id", authMiddleware, AppointmentsController.update );
router.delete( "/appointments/:id", authMiddleware, AppointmentsController.remove );

router.get("/barber-schedules", authMiddleware, requirePermission( "barber_schedule.access" ), BarberScheduleController.list );
router.post( "/barber-schedules", authMiddleware, requirePermission( "barber_schedule.access" ), BarberScheduleController.create );
router.get( "/barber-schedules/:id", authMiddleware, requirePermission( "barber_schedule.access" ), BarberScheduleController.getById);
router.put( "/barber-schedules/:id", authMiddleware, requirePermission( "barber_schedule.access" ), BarberScheduleController.update);
router.delete( "/barber-schedules/:id", authMiddleware, requirePermission( "barber_schedule.access" ), BarberScheduleController.remove);


app.use(router);


export default app;