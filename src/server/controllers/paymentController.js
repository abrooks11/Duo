import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const paymentController = {
  /** GET UNPAID EOBS
   * fetch eobs from payments table; want rows where isPaid is false
   */
  getUnpaidEOBs: async (req, res, next) => {
    try {
      console.log('inside function');

      // const eobList = await prisma.payment.findMany({
      //   where: {
      //     isPaid: 'false',
      //   },
      // });
      // console.log({ eobList });
      // if (!eobList) {
      //   return next('Error: Error fetching payments');
      // }

      // res.locals.eobs = eobList;

      return next();
    } catch (error) {
      return next(error);
    }
  },

  
};

export default paymentController;
