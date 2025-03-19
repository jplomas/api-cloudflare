import { Bool, OpenAPIRoute } from "chanfana";
import { z } from "zod";
import { StartResp, StartReq } from "../types";
// @ts-ignore
import calc from "@saferinsulin/core";

export class Start extends OpenAPIRoute {
	schema = {
		tags: ["Calculation"],
		summary: "Starting insulin infusion",
		request: {
			body: {
				content: {
					"application/json": {
						schema: StartReq,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Returns calculator advice",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: StartResp
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
		const userData = data.body;

		// Implement your own object insertion here
    // test governance code: 041-d334909
    const ins = new calc();
    console.log({userData});
    const gov = ins.startingRate(userData.glucose); 
    console.log(gov);

		// return the governance data
		return {
			success: true,
			result: {
				rate: gov.rate,
				rateNum: gov.rateNum,
				advice: gov.advice,
				hex: gov.hex,
			},
		};
	}
}
