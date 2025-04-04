import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { GovResp, GovReq } from "../types";
// @ts-ignore
import calc from "@saferinsulin/core";

export class Governance extends OpenAPIRoute {
	schema = {
		tags: ["Governance"],
		summary: "Looks up a governance code",
		request: {
			body: {
				content: {
					"application/json": {
						schema: GovReq,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns governance data",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: GovResp
							}),
						}),
					},
				},
			},
		},
	};

	async handle() {
		// Get validated data
		const data = await this.getValidatedData<typeof this.schema>();

		// Retrieve the validated request body
		const governanceCode = data.body;

		// parse governance code using calculator module
    const ins = new calc();
    const gov = ins.governance(governanceCode.code); 

		// return the governance data
		return {
			success: true,
			result: {
				function: gov.function,
				current: gov.current,
				rate: gov.rate,
				last: gov.last,
				date: gov.date,
        version: gov.version,
			},
		};
	}
}
