export default {
	fileSystem: {
		path: "./databases",
	},

	mongodb: {
		cnxStr: "mongodb+srv://davidbolivar:asd123@cluster0.lm0ks.mongodb.net/coder_backend_3era?retryWrites=true&w=majority",
		options: {
			// useNewUrlParser: true,
			// useUnifiedTopology: true,
			// useCreateIndex: true,
			serverSelectionTimeoutMS: 5000,
		},
		sessionTimeout: 500000,
	},

	firebase: {
		type: "service_account",
		project_id: "coder-backend-9e196",
		private_key_id: "9ddfeb8d7603bb1656051cd3e46278a38f8fa319",
		private_key:
			"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8nb/ZDNXIBDrY\nd8pItJQjkd41Hus8ArgA2VwvFPovVVoUYtPWci2hstU8CD7+FJ6BM2FSKgk12VsD\n5CHUJujnTKN8WOOhgH90kPh1SNZSJa+llIu7CRZS34aGUVfQpVfhppTCgDujoALo\nu/f2RpE287CcsoVzNshBT/hW7/e9xgWwhjr7pX2aLd0+OrFEn1Pj7/iuw77jkRlO\ntwgkY6XKemM2czbRM78bJoVP9Sf0/iDof8HquAMYhks/RFXOCs1q7aNq0MQU7LES\ncf3caGhVZib/XmdW1j5wByu12b1Y5reac1tYovX99w+Kbb8R9N4ZpWJAjLP3ZDq9\ns6dCOKVvAgMBAAECggEAIXv1y4AKUbxif/xgJmEcbWYfZxnKk/g9lzT/NwKH2bBS\n0gyrY8YYULzxOvuRx0R80R4AeHgq82rXTA0LbmDL9wf1fAVBv/GSbuyvlw6rsaCs\nGn6RAc6+rk6tUJoPN2SrAc2zWgYu0ED/UzbPceKcM/+2ClNs+oOusF2UjkaCmidH\n5FE3dkMQygCy5cBdNqPqsIiHI0amddQ/mgawfA9XHT/oHASDC/uT8788X1zniGoD\nTIKvlVwPMLDXcV6+vOpBYHKwnXM/J1IZkDqAtQ8HQw9gLuo5c5rmMTByVeGwxf2u\nfzcft81Q34t21sVyMgotrlNSc9OTr/itGPEC6QW9GQKBgQDdtaz2ZQSYekW4AF5n\nuy5KgFQEaotY7Hn+alzVQKjtmjc5daVtY0TIS1DB5saDwb/y6LE6wBxhd33LkwoJ\nH+mOrHDYxmIQ9cl2in/O581mYJ3fslnwAvW2GxW3vLiQt/pwOIhW3t5iQG9RmMyP\nYdJrj1GDBYRjbiB0cZbgd4bZVwKBgQDZycdI7z9A1XVKDfxvZ6QqZT5hYuMKm2Wg\nSxdlVpHSdXDjt7Pl9QV20jqw3Bbps8lWFtKhLHEsqe7UI78qWeaIhHZ0AuhYCVwL\nVlZu0cH61gpWuAtsE5uqfYaPMf9DdAlpacgZb4ZFMNqyo87Sg7CyAmlrF7z5ZrNB\nAiUpw0xNqQKBgDwEaz8EF5tjNi5aQzQXcq+OT7AmW3SGB3w8tMaxy0kOvzZZx592\nCO+jm8fxvfl64IhUP23lBYnI/A+4zTWtIt+RhLbZ9UAcGR5y3ahYDb1SGEqvEDOt\nyXAzosxrVRcwBqaMVzQU/uRgBwJyt6V02K5vTKSIQM9dx4FeIna/RIzfAoGAehau\nfAl6uRqwpLIQeFduZUHaZXes9W5F20UdOXb9SjEB9vYtiFUCGikiM7E9uwdJb9Rd\ngXLLgxFETHI5oUFChfdT/BcBLxEYI1bkHz3Bc593rkOAS7b2Re4Wd8G8apDrEcf2\nH6QwbitD/m7r64FdlXzaoelty5YyGNheAvpzlPkCgYBmy3GLsnPOMpkvmD+n0ECJ\n4Z8sP1MdXloxBGBwsA10V2FyqRm2bQ78sfIePp/+5F20tAjznMn9Tu+X2WnTumHx\nO/rD5g8t6mON7ttafjZR+aMRr8PEtCJzMjAd8syckSDaYuuJdLG/AmcTaFxyKlkZ\nDyl+CErVTj4B6oPM0m4eMw==\n-----END PRIVATE KEY-----\n",
		client_email: "firebase-adminsdk-w7cha@coder-backend-9e196.iam.gserviceaccount.com",
		client_id: "109919712463548553103",
		auth_uri: "https://accounts.google.com/o/oauth2/auth",
		token_uri: "https://oauth2.googleapis.com/token",
		auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
		client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-w7cha%40coder-backend-9e196.iam.gserviceaccount.com",
	},
	persistence: "mongodb",
};
