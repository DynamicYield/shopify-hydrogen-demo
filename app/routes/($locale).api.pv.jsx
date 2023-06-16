import {json} from '@shopify/remix-oxygen';

import {reportPageView} from '~/dyapi';

export async function action({request, context}) {
  const headers = new Headers();
  var pageContext = Object.fromEntries(await request.formData());
  if (pageContext && pageContext.data && !Array.isArray(pageContext.data)) pageContext.data = [pageContext.data];
  let status = 200;
  
  reportPageView(request, context, pageContext);
  
  return json(
    {status: 'success'},
    {status, headers},
  );
}

export function shouldRevalidate({actionResult, defaultShouldRevalidate}) {
  return false;
}

// no-op
export default function PvApiRoute() {
  return null;
}
