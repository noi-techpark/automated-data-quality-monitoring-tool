// SPDX-FileCopyrightText: 2024 Catch Solve di Davide Montesin
//
// SPDX-License-Identifier: AGPL-3.0-or-later

declare namespace Chart {

	interface ChartConfiguration {
	}


	interface ChartDataSets {
	}


	interface ChartData {
		labels: string[],
		datasets: ChartDataSets[]
	}

}


declare class Chart {
	constructor(
		context: HTMLCanvasElement,
		options: Chart.ChartConfiguration
	);
	data: Chart.ChartData;
	update: () => void;
	
}
