import dotenv from 'dotenv';
dotenv.config()
const constants = {
    ENUMS: {
      ORDER: {
        ASC: 'asc',
        DESC: 'desc',
      },
      HASH_TYPES: {
        CREATE_NEW_ACCT: 'CREATE_NEW_ACCT',
        RESET_PASSWORD: 'RESET_PASSWORD',
        UPDATE_EMAIL: 'UPDATE_EMAIL',
        INVITE_EMAIL: 'INVITE_EMAIL',
      },
      FILE_FORMAT: {
        PNG: '.png',
        SVG: '.svg',
        PDF: '.pdf',
        GIF: '.gif',
        WEBP: '.webp',
      },
      LOGIN_TYPE: {
        GOOGLE: 'GOOGLE',
        FACEBOOK: 'FACEBOOK',
        CUSTOM: 'CUSTOM',
      },
      MIME_TYPE: {
        IMAGE: {
          SVG: 'image/svg+xml',
          PNG: 'image/png',
          PDF: 'application/pdf',
          GIF: 'image/gif',
          WEBP: 'image/webp',
        },
      },
      ACL_TYPE: {
        PUBLIC: 'public-read',
        PRIVATE: 'private',
      },
      HASH_EXPIRES_IN: {
        DEFAULT_EXPIRY: 10,
        INVITE_EXPIRY: 1440,
      },
      USER_STATUS: {
        INVITED: 'invited',
        NONE: null,
      },
    },
    RESP_ERR_CODES: {
      ERR_400: 400,
      ERR_401: 401,
      ERR_422: 422,
      ERR_500: 500,
      ERR_403: 403,
      ERR_404: 404,
      ERR_405: 405,
      ERR_409: 409,
      ERR_410: 410,
      ERR_412: 412,
    },
    ERROR_MESSAGES: {
      NOT_AUTHORISED: 'You are not authorized',
      USER_NOT_FOUND: 'User not found.',
      USER_ALREAD_EXISTS: 'User already exists',
      INVALID_PASSWORD: 'Invalid Password',
      EMIL_NOT_VERIFIED: 'Email not verified',
      RECORD_NOT_FOUND: 'Record not found.',
      PASSWORD_NOT_MATCHED: 'Old Password does not match',
      SAME_OLD_PASSWORD: 'New Password is Same as old',
      HASH_EXPIRED: 'Hash expired',
      HASH_NOT_FOUND: 'Link Expired ',
      ADDRS_NOT_FOUND: 'User billing address not found.',
      TYPE_NOT_FOUND: 'Type not Found!',
      CATEGORY_NOT_FOUND: 'Category not Found!',
      SUB_CATEGORY_NOT_FOUND: 'Sub Category not Found!',
      FORGOT_PASSWORD_REQUEST: `The account currently has no password set. We recommend requesting a 'Forgot Password'.`,
      VERIFICATION_CODE_INVALID: 'Invalid verification code',
      VERIFICATION_CODE_EXPIRED: 'The verification code has been expired.',
      USER_ALREADY_EXIST: 'The provided credentials already exit please sign in ',
      USERNAME_NOT_AVAILABLE: 'The Username is not available .',
      NO_NOTIFICATION_FOUND : 'No notifications found',
      NO_EMOTION_FOUND :  'No emotions found',
      OPPONENT_NOT_FOUND :  `Selected Opponent doesn't exist`,
      INVALID_TURN :  `Invalid turn or turn is already completed !`,
      GAME_DOES_NOT_BELONG_TO_YOU :  `You are not in the game`,
      GAME_NOT_FOUND :  `Could not find the game !`,
      NOT_YOUR_TURN :  `Not your turn , let opponent finish first !`,
      COULD_NOT_CREATE_TURN :  `Could not create your turn !`,
      TURN_NOT_FOUND :  `Not a valid turn !`,
      INSUFFICIENT_COINS :  `Insufficient Coins !`,
      LOCATION_PERMISSION_DENIED :  `To access nearby friend's please allow location permission in settings.`,
    },
    SUCCESS_MESSAGES: {
      EMAIL_SEND: 'Email send successfully',
      OK: 'OK',
      REGISTERED: 'Registered',
      PASSWORD_CHANGED: 'Password changed',
      PASSWORD_SET: 'Password set successfully',
      PASSWORD_RESET: 'Password reset successfully',
      BUCKET_DELETED: 'Bucket deleted successfully.',
      BUCET_UPDATED: 'Bucket updated succesfully.',
      STYLE_SET_UPDATED: 'Style set Updated.',
      BUCKET_ICON_DELETED: 'Bucket icon deleted.',
      EMAIL_UPDATED: 'Email updated successfully',
      TYPE_CREATED: 'Type Created Successfully.',
      TYPE_UPDATED: 'Type Updated Successfully',
      TYPE_DELETED: 'Type Deleted Successfully',
      CATEGORY_CREATED: 'Category Created Successfully.',
      CATEGORY_UPDATED: 'Category Updated Successfully',
      CATEGORY_DELETED: 'Category Deleted Successfully',
      SUB_CATEGORY_CREATED: 'Sub Category Created Successfully.',
      SUB_CATEGORY_UPDATED: 'Sub Category Updated Successfully',
      SUB_CATEGORY_DELETED: 'Sub Category Deleted Successfully',
      PROFILE_UPDATE: 'Profile Details Update Successfully',
    },
    INS_EXCLUDE_COLS: ['created_at', 'updated_at', 'deleted_at'],
    DB_STATES: [
      {
        value: 0,
        label: 'disconnected',
      },
      {
        value: 1,
        label: 'connected',
      },
      {
        value: 2,
        label: 'connecting',
      },
      {
        value: 3,
        label: 'disconnecting',
      },
    ],
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || 'faceoffmedia',
    ASSET_FOLDER_PATH: {
      FACEOFF_GAME : 'faceoff/game',
      SHOPIFY : 'shopify',
    },
    NODEMAILER: {
      SENDER_NAME: 'FaceOff',
      SENDER_EMAIL: `no-reply@${process.env.COMPANY_DOMAIN}`,
      MAIL_SUBJECT : {
        PASSWARD_CHANGE : 'Password Change Requested !'
      },
      MAIL_TEMPLATE : {
        CHANGE_PASSWORD : 'changePassword'
      }
    },
    EMAIL_PATH : 'src/views/email-templates',
    DEEPLINK_PATH: {
      SIGUP : 'signup',
      LOGIN : 'login',
      RESET_PASSWORD : 'resetPassword' 
    },
    NOTIFICATION_TITILES : {
      NEW_GAME_STARTED : 'New Game Started',
      ITS_YOUR_TURN : 'Opponent has finished , its your turn now',
    },
    NOTIFICATION_TYPES : {
      GAME_STRATED : 'GAME_STARTED',
      TURN_CREATED : 'TURN_CREATED'
    },
    USER_SELECION_TYPES : {
      RANDOM : 'random',
      EMAIL : 'email',
      USERNAME : 'username'
    },
    LEADER_BOARD_FILTER : {
      friends : 'Friends',
      country : 'Country',
      global : 'Global'
    },
    LIFELINE_TYPE : {
      '50_50' : 10,
      'DOUBLE_DIP' : 20,
      'DEFINE_WORD' : 30,
    }
};
  
  export default constants;
  