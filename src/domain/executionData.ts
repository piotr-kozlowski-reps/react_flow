import { url } from "./constants";
import type { Execution, ExecutionDTO } from "./types";
import axios from "axios";

export async function getExecutionData(
  prc_id: number,
  token: string
): Promise<Execution[]> {
  const execution: Execution[] = [];

  const response = await axios.get<{
    data: {
      resultMainQuery: ExecutionDTO[] | -1;
    };
  }>(
    `${url}/api.php/REST/custom/korsolgetreport?module=GRUNT&rep_id=222&prc_id=${prc_id}`,
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

  const executionArrayDTO: ExecutionDTO[] = response.data.data
    .resultMainQuery as ExecutionDTO[];

  executionArrayDTO.map((item) => {
    execution.push({
      id____: item.id____,
      ordnmb: item.ordnmb,
      name_to: item.name_to,
      suma: Number.parseInt(item.suma),
      twr_kod: item.twr_kod,
      sordid: Number.parseInt(item.sordid),
      data_przeniesienia: new Date(item.data_przeniesienia),
      fullnm: item.fullnm,
      movfrm: item.movfrm ? Number.parseInt(item.movfrm) : null,
      optime: item.optime,
      mov_to: Number.parseInt(item.mov_to),
      name_from: item.name_from,
      ile_wz: Number.parseInt(item.ile_wz),
      ile_wz_status: Number.parseInt(item.ile_wz_status),
      movqty: Number.parseInt(item.movqty),
      keyval: Number.parseInt(item.keyval),
      clsnam: item.clsnam,
      prc_id: Number.parseInt(item.prc_id),
    });
  });

  return execution;
}
