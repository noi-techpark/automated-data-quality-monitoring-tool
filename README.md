# Automated data quality monitoring tool


Dashboard web application that visualises stats about potential data quality issues to be improved in [Open Data Hub](https://opendatahub.com). The statistics are divided by dataset and make it possible to quickly find records with improvable data.


**Table of contents**

- [Automated data quality monitoring tool](#automated-data-quality-monitoring-tool)
	- [Getting started](#getting-started)
		- [Prerequisites](#prerequisites)
		- [Source code](#source-code)
		- [Build](#build)
	- [Deployment](#deployment)
	- [Information](#information)
		- [Support](#support)
		- [Contributing](#contributing)
		- [Documentation](#documentation)
		- [License](#license)

## Getting started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Java JDK 21 or higher (e.g. [OpenJDK](https://openjdk.java.net/))
- [Maven](https://maven.apache.org/) 3.x

### Source code

Get a copy of the repository:

```bash
git clone git clone https://github.com/noi-techpark/automated-data-quality-monitoring-tool.git
```

Change directory:

```bash
cd automated-data-quality-monitoring-tool
```

### Build

Build the project:

```bash
mvn clean package
```


## Deployment

This is a maven project and will produce a war that can be deployed in any j2ee container like tomcat or jetty.

* create the war executing the following command

```bash
mvn clean package
```

* confiure environment variable JDBC_URL=jdbc:postgresql://server/database?user=xxx&password=yyy to point the postgres database
* deploy the war to a j2ee container like tomcat or jetty


## Information

### Support

For support, please contact [help@opendatahub.com](mailto:help@opendatahub.com).

### Contributing

If you'd like to contribute, please follow
our [Getting Started](https://github.com/noi-techpark/odh-docs/wiki/Contributor-Guidelines:-Getting-started)
instructions.

### Documentation

More documentation can be found at
[https://docs.opendatahub.com](https://docs.opendatahub.com).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See
the [LICENSE](../../LICENSE) file for more information.