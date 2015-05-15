
exports.for = function (API) {

	var exports = {};

	exports.resolve = function (resolver, config, previousResolvedConfig) {

		return resolver({}).then(function (resolvedConfig) {

			API.ASSERT(typeof resolvedConfig.basePath, "string");
			API.ASSERT(typeof resolvedConfig.commands, "object");
			API.ASSERT(typeof resolvedConfig.commands.start !== "undefined", true);

			return resolvedConfig;
		});
	}

	exports.spin = function (resolvedConfig) {

		return API.Q.denodeify(function (callback) {

			var env = {};
			for (var name in process.env) {
				env[name] = process.env[name];
			}
			if (resolvedConfig.env) {
				for (var name in resolvedConfig.env) {
					env[name] = resolvedConfig.env[name];
				}
			}

			return API.runProgramProcess({
				label: API.getDeclaringPathId() + "/" + resolvedConfig.$to,
				commands: resolvedConfig.commands.start,
				cwd: resolvedConfig.basePath,
				env: env
			}, callback);

		})();
	}

	return exports;
}
