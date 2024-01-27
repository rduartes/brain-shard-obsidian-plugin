enum LogOutput {
	console,
	notice
}

export class Logger {
	static shouldLog = false;
	static loggerMode:LogOutput = LogOutput.console;

	static log(caller?:any, message?:any, ...rest:any[]) {
		if(Logger.shouldLog) {
			console.log(caller, message, rest);
		}
	}
}
