import { Router } from 'express';
import UserRoute from './app/user/user';
import EmotionRoute from "./app/emotion/emotion";
import ShopifyRoutes from "./shopify/shopifyUsers/shopifyUsers";
import GameRoutes from "./app/game/game";
import NotificationRoutes from "./app/notification/notification";
import AdminRoutes from "./admin/admin";
const router = Router();

new UserRoute(router);
new EmotionRoute(router);
new ShopifyRoutes(router);
new GameRoutes(router);
new NotificationRoutes(router);
new AdminRoutes(router);

export default router;
