import { url } from "./constants";
// import type { Execution, ExecutionDTO } from "./types";
import axios from "axios";

import type { Cut, CutDTO } from "./types";

export async function getCutData(
  prc_id: number,
  token: string
): Promise<Cut[]> {
  const cuts: Cut[] = [];

  const response = await axios.get<{
    data: {
      resultMainQuery: CutDTO[] | -1;
    };
  }>(
    `${url}/api.php/REST/custom/korsolgetreport?module=GRUNT&rep_id=1625&prc_id=${prc_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (
    !response.data.data.resultMainQuery ||
    response.data.data.resultMainQuery === -1
  ) {
    throw new Error("Błąd pobierania danych"); //TODO: error handling
  }

  const cutsArrayDTO: CutDTO[] = response.data.data.resultMainQuery as CutDTO[];

  cutsArrayDTO.map((item) => {
    cuts.push({
      ordnmb: item.ordnmb,
      zlecajacy: item.zlecajacy,
      wykonujacy: item.wykonujacy,
      plndat: item.plndat ? new Date(item.plndat) : null,
      stkcnt: Number.parseInt(item.stkcnt),
      cutdat: item.cutdat ? new Date(item.cutdat) : null,
      height: item.height ? Number.parseInt(item.height) : null,
      height_done: item.height_done ? Number.parseInt(item.height_done) : null,
      adddat: item.adddat ? new Date(item.adddat) : null,
      planam_done: item.planam_done,
    });
  });

  return cuts;
}
