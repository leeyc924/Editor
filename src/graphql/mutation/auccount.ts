import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import crypto from 'crypto';

import logUtil from '../../utils/log';

import AccountModel from "../../database/models/account";

AccountModel.AccountTC.addResolver({
  name: 'signUp',
  args: { accountEmail: 'String', accountPw: 'String'},
  type: AccountModel.AccountTC,
  resolve: async ({ source, args }) => {
    try {
      
      const accountId = dayjs().unix() + v4().substr(0, 8);
      const accountEmail = args.accountEmail;
      let accountPw = args.accountPw;
      const placeId = dayjs().unix() + v4().substr(0, 8);
      const viewPlaceId = dayjs().unix() + v4().substr(0, 8);
      const accountType = '';
      const lastLoginDt = dayjs().toISOString();
      const pwChangeDt = dayjs().toISOString();
      const imagePath = '';
      const imageSize = '';
      const useYn = 'Y';
      const delYn = 'N';
      const delDt = '';
      const regDt = dayjs().toISOString();
      const modDt = dayjs().toISOString();

      const hashPw = crypto.createHash('sha256').update(accountPw).digest('hex');

      const accountInfo = {
        accountId,
        accountEmail,
        accountPw: hashPw,
        placeId,
        viewPlaceId,
        accountType,
        lastLoginDt,
        pwChangeDt,
        imagePath,
        imageSize,
        useYn,
        delYn,
        delDt,
        regDt,
        modDt,
      }

      await AccountModel.AccountSchema.create({
        ...accountInfo,
      });

      let payload: any = {};
      payload.accountId = accountId;
      payload.accountEmail = accountEmail;

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          payload,
          process.env.CORE_JWT_SECRET || '',
          { expiresIn: '1d' },
          (err, token) => {
            if (err) {
              reject(err);
            } else {
              resolve(token);
            }
          },
        );
      });

      return { token };
    } catch (error) {
      logUtil.error(error.toString());

      return false;
    }
  },
});