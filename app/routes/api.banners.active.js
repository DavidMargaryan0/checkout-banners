import { json } from '@remix-run/node';
import { fetchActiveBanner } from "../modules/banner/service";

export const loader = async ({ request }) => {
  try {
    const activeBanner = await fetchActiveBanner();
    return json({ activeBanner });
  } catch (error) {
    return json({ activeBanner: null });
  }
};