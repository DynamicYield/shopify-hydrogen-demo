import {useMatches} from '@remix-run/react';

var url = require('url');

// API key and API host are taken from the envoronmental variables:
// DY_API_KEY
// DY_API_HOST
// When running locally, they come from the .env file in the project root. 
// When hosted in Oxygen, they are set in the Shopify configuration. 
// https://shopify.dev/docs/custom-storefronts/oxygen/storefronts/environment-variables

export async function choose(request, context, pageContext, selectors = [], isImplicitPageview = false) {
  const uri = `${context.env.DY_API_HOST}/v2/serve/user/choose`;
  const options = {
    method: 'POST',
    headers: {
      'DY-API-Key': context.env.DY_API_KEY,
    },
    body: JSON.stringify({
      selector: {
        names: selectors,
      },
      user: {
        id: getUserId(request, context),
      },
      session: {
        dy: getSessionId(request, context),
      },
      context: getDyContext(request, context, pageContext),
      options: {isImplicitPageview: isImplicitPageview},
    }),
  };

  let variations = {};
  try {
    const response = await fetch(uri, options).then((res) => {
      return res.json();
    });
    
    variations = response.choices.reduce(flattenCampaignData, {});
    console.log(`Choices by campaign: ${JSON.stringify(variations, null, 2)}`);
  } catch (e) {
    console.error(`ERROR IN CHOOSE: ${e.message}`);
  }
  return variations;
}

export async function reportPageView(request, context, pageContext) {
  return await choose(request, context, pageContext, [], true);
}

function getUserId(request, context) {
  return '';
}

function getSessionId(request, context) {
  return '';
}

function getDyContext(request, context, pageContext) {
  return {
    page: {...{
      location: request.url,
      referrer: request.referrer || '',
      type: 'OTHER',
      data: [],
      locale: `${context.storefront.i18n.language}_${context.storefront.i18n.country}`,
    }, ...pageContext},
    device: {
      userAgent: request.headers.get('user-agent') || '',
      ip: request.headers.get('oxygen-buyer-ip'),
    },
    pageAttributes: url.parse(request.url, true).query,
  };
}

export function useContextFromLoaders(dataKey = 'pageContext') {
  const matches = useMatches();
  const data= {};

  matches.forEach((event) => {
    const eventData = event?.data;
    if (eventData && eventData[dataKey]) {
      Object.assign(data, eventData[dataKey]);
    }
  });

  return data;
}

function flattenCampaignData(res, choice) {
  let data = null;
  if (choice.variations.length > 0) {
    switch (choice.type) {
      case 'DECISION':
        data = { decisionId: choice.decisionId, ...choice.variations[0].payload.data };
        break;
      case 'RECS_DECISION':
        data = choice.variations[0].payload.data.slots.map(
                  slot => ({ ...slot.productData, sku: slot.sku, slotId: slot.slotId }));
        break;
      default:
        throw new Error('Unknown choice type: ' + choice.type);
    }
  }

  res[choice.name] = data;
  return res;
}

export async function reportClick(request, context, engagement) {
  try {
    const options = {
      method: 'POST',
      url: `${context.env.DY_API_HOST}/v2/collect/user/engagement`,
      headers: {
        'DY-API-Key': context.env.DY_API_KEY,
      },
      body: {
        user: {
          id: getUserId(request, context),
        },
        session: {
          dy: getSessionId(request, context),
        },
        engagements: [engagement],
      },
      json: true,
    }
    const response = await fetch(uri, options).then((res) => res.json());
    console.log("Engagement reported: " + JSON.stringify(engagement));
  } catch (e) {
    console.error(`ERROR IN ENGAGEMENT: ${e.message}`);
  }
}

export async function reportEvent(request, context, event) {
  try {
    const options = {
      method: 'POST',
      url: `${context.env.DY_API_HOST}/v2/collect/user/event`,
      headers: {
        'DY-API-Key': context.env.DY_API_KEY,
      },
      body: {
        user: {
          id: getUserId(request, context),
        },
        session: {
          dy: getSessionId(request, context),
        },
        events: [event],
      },
      json: true
    };
    const response = await fetch(uri, options).then((res) => res.json());
    console.log("Event reported: " + JSON.stringify(event));
  } catch (e) {
    console.error(`ERROR IN EVENT: ${e.message}`);
  }
}