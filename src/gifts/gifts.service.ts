import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGiftDto } from './dtos/create-gift.dto';
import { UpdateGiftDto } from './dtos/update-gift.dto';

@Injectable()
export class GiftsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    if (!userId) {
      return [];
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return [];
    }

    return await this.prisma.gift.findMany({ where: { userId } });
  }

  async create(userId: string, data: CreateGiftDto) {
    if (!userId) {
      return {
        message: 'id is required',
      };
    }

    if (!data) {
      return {
        message: 'data is required',
      };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    return await this.prisma.gift.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async update(userId: string, id: string, data: UpdateGiftDto) {
    if (!userId || !id) {
      return {
        message: "id's is required",
      };
    }

    if (!data) {
      return {
        message: 'data is required',
      };
    }

    const [user, gift] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      this.prisma.gift.findUnique({
        where: {
          id,
        },
      }),
    ]);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    if (!gift) {
      return {
        message: 'Gift not found',
      };
    }

    return await this.prisma.gift.update({
      where: {
        id,
      },
      data,
    });
  }

  async findOne(userId: string, id: string) {
    if (!userId || !id) {
      return {
        message: "id's is required",
      };
    }

    const [user, gift] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),

      this.prisma.gift.findUnique({
        where: {
          id,
        },
      }),
    ]);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    if (!gift) {
      return {
        message: 'Gift not found',
      };
    }

    return gift;
  }

  async delete(userId: string, id: string) {
    if (!userId || !id) {
      return {
        message: "id's is required",
      };
    }

    const [user, gift] = await this.prisma.$transaction([
      this.prisma.user.findUnique({
        where: {
          id: userId,
        },
      }),
      this.prisma.gift.findUnique({
        where: {
          id,
        },
      }),
    ]);

    if (!user) {
      return {
        message: 'User not found',
      };
    }

    if (!gift) {
      return {
        message: 'Gift not found',
      };
    }

    return await this.prisma.gift.delete({
      where: {
        id,
      },
    });
  }

  async getUserCategories(userId: string) {
    if (!userId) {
      return { message: 'id is required' };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const gifts = await this.prisma.gift.findMany({
      where: {
        userId,
      },
    });

    const categories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      acc[gift.category] += 1;

      return acc;
    }, {});

    const notCompletedCategories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      if (!gift.isCompleted) {
        acc[gift.category] += 1;
      }

      return acc;
    }, {});

    const completedCategories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      if (gift.isCompleted) {
        acc[gift.category] += 1;
      }

      return acc;
    }, {});
    return {
      items: {
        all: {
          ...categories,
        },
        completed: {
          ...completedCategories,
        },
        notCompleted: {
          ...notCompletedCategories,
        },
      },
      all: gifts.length,
    };
  }

  async getUserAnalytics(userId: string) {
    if (!userId) {
      return { message: 'id is required' };
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { message: 'User not found' };
    }

    const gifts = await this.prisma.gift.findMany({
      where: {
        userId,
      },
    });

    const allTotalItems = gifts.length;
    const completedTotalItems = gifts.filter((gift) => gift.isCompleted).length;
    const notCompletedTotalItems = allTotalItems - completedTotalItems;

    const allTotalPrice = gifts.reduce((acc, gift) => acc + gift.price, 0);
    const completedTotalPrice = gifts
      .filter((gift) => gift.isCompleted)
      .reduce((acc, gift) => acc + gift.price, 0);
    const notCompletedTotalPrice = allTotalPrice - completedTotalPrice;

    const allAvgItemsPrice = allTotalPrice / allTotalItems;
    const completedAvgItemsPrice = completedTotalPrice / completedTotalItems;
    const notCompletedAvgItemsPrice =
      notCompletedTotalPrice / notCompletedTotalItems;

    const allCatergories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      acc[gift.category] += 1;

      return acc;
    }, {});

    const notCompletedCatergories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      if (!gift.isCompleted) {
        acc[gift.category] += 1;
      }

      return acc;
    }, {});

    const completedCatergories = gifts.reduce((acc, gift) => {
      if (!acc[gift.category]) {
        acc[gift.category] = 0;
      }

      if (gift.isCompleted) {
        acc[gift.category] += 1;
      }

      return acc;
    }, {});

    const mostAllCategory = Object.entries(allCatergories).sort(
      (a: any, b: any) => b[1] - a[1],
    )[0][0];

    const mostCompletedCategory = Object.entries(completedCatergories).sort(
      (a: any, b: any) => b[1] - a[1],
    )[0][0];

    const mostNotCompletedCategory = Object.entries(
      notCompletedCatergories,
    ).sort((a: any, b: any) => b[1] - a[1])[0][0];

    return {
      all: {
        totalItems: allTotalItems,
        totalPrice: allTotalPrice.toFixed(2),
        avgItemsPrice: allAvgItemsPrice.toFixed(2),
        mostCategory: `${mostAllCategory}`,
      },
      completed: {
        totalItems: completedTotalItems,
        totalPrice: completedTotalPrice.toFixed(2),
        avgItemsPrice: completedAvgItemsPrice.toFixed(2),
        mostCategory: `${mostCompletedCategory}`,
      },
      notCompleted: {
        totalItems: notCompletedTotalItems,
        totalPrice: notCompletedTotalPrice.toFixed(2),
        avgItemsPrice: notCompletedAvgItemsPrice.toFixed(2),
        mostCategory: `${mostNotCompletedCategory}`,
      },
    };
  }
}
