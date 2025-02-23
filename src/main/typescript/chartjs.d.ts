

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
