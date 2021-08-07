const Sentry = require("@sentry/node");
const { sendLogInfo, sendLogError } = require("../../../logs/coralogix");
const Partner = require("../../../models/restaurant");
const User = require("../../../models/user");

function countItems(arr) {
  const countMap = Object.create(null);

  for (const element of arr) {
    if (!countMap[element]) {
      // Se ainda não existir elemento, definimos como um, já que
      // estamos na primeira ocorrência.
      countMap[element] = 1;
    } else {
      // Caso contrário, incrementamos um no número atual.
      countMap[element] += 1;
    }
  }

  return countMap;
}

const NewOrder = async (message) => {
  for (const order of message) {
    const transaction = Sentry.startTransaction({
      op: "CRIANDO PEDIDO",
      name: "Criando pedido e executando processos",
    });

    console.log(order);

    const {
      user: { name: username, _id: UserId },
      restaurant: { _id: PartnerId, name },
      categories,
      categoriesDrink,
      createdAt,
      DeliveriedAt,
    } = order;

    if (createdAt && DeliveriedAt) {
      try {
        sendLogInfo({
          data: `Recalculando tempo de entrega para o parceiro ${name}`,
          name: "INFO",
        });

        const date1 = new Date(
          createdAt.slice(0, 4),
          createdAt.slice(4, 6),
          createdAt.slice(6, 8),
          createdAt.slice(9, 11),
          createdAt.slice(12, 14)
        );
        const date2 = new Date(
          DeliveriedAt.slice(0, 4),
          DeliveriedAt.slice(4, 6),
          DeliveriedAt.slice(6, 8),
          DeliveriedAt.slice(9, 11),
          DeliveriedAt.slice(12, 14)
        );

        const diffMs = date2 - date1;
        const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
        const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);

        const partner = await Partner.findOne({ PartnerId });

        const mediaDate = diffHrs * 60 + diffMins;

        partner.TimesOfDelivery.push(mediaDate);

        const some = partner.TimesOfDelivery.reduce(function (total, numero) {
          return total + numero;
        }, 0);

        const mediaTime = some / partner.TimesOfDelivery.length;

        partner.TimeOfDelivery = Math.round(mediaTime);

        await partner.save();
      } catch (error) {
        Sentry.captureException(error);
        sendLogError({
          data: error,
          name: "ERROR IN RECALCULATE PARTNER DELIVERY TIME",
        });
      }
    }

    if (categories && DeliveriedAt) {
      try {
        sendLogInfo({
          data: `Recalculando sugestões para o usuário ${username}`,
          name: "INFO",
        });

        const user = await User.findOne({ UserId });

        for (const categorie of categories) {
          user.Categories.push(categorie);
        }

        for (const categorieDrink of categoriesDrink) {
          user.CategoriesDrink.push(categorieDrink);
        }

        const formatedCategorie = countItems(user.Categories);
        const formatedCategorieDrink = countItems(user.CategoriesDrink);

        const arrayOfRequestedTimesCategorie = [];
        const arrayOfRequestedTimesCategorieDrink = [];

        for (const categorieFind of user.Categories) {
          const timesOfRequsted = formatedCategorie[categorieFind];

          arrayOfRequestedTimesCategorie.push(timesOfRequsted);
        }

        for (const categorieFindDrink of user.CategoriesDrink) {
          const timesOfRequsted = formatedCategorieDrink[categorieFindDrink];

          arrayOfRequestedTimesCategorieDrink.push(timesOfRequsted);
        }

        const moreRequested = Math.max(...arrayOfRequestedTimesCategorie);
        const moreRequestedDrink = Math.max(
          ...arrayOfRequestedTimesCategorieDrink
        );

        let resultCategorie;
        let resultCategorieDrink;

        for (const categorieFind of user.Categories) {
          const timesOfRequsted = formatedCategorie[categorieFind];

          if (moreRequested === timesOfRequsted) {
            resultCategorie = categorieFind;
          }
        }

        for (const categorieFindDrink of user.CategoriesDrink) {
          const timesOfRequsted = formatedCategorieDrink[categorieFindDrink];

          if (moreRequestedDrink === timesOfRequsted) {
            resultCategorieDrink = categorieFindDrink;
          }
        }

        user.Sugestion = resultCategorie;
        user.SugestionDrink = resultCategorieDrink;

        await user.save();
      } catch (error) {
        Sentry.captureException(error);
        sendLogError({
          data: error,
          name: "ERROR IN RECALCULATE USER PREFERENCES",
        });
      }

      sendLogInfo({
        data: `Todos os processos foram rodados`,
        name: "INFO",
      });

      transaction.finish();
    }
  }
};

module.exports = NewOrder;
