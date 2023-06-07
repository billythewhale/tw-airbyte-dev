#
# Copyright (c) 2023 Airbyte, Inc., all rights reserved.
#


from setuptools import find_packages, setup

MAIN_REQUIREMENTS = [
    "airbyte_cdk @ https://us-central1-python.pkg.dev/triple-whale-staging/sensory/airbyte-cdk/airbyte_cdk-0.37.0.0-py3-none-any.whl",
]

TEST_REQUIREMENTS = [
    "pytest~=6.1",
    "requests-mock",
]

setup(
    version="0.0.2",
    name="source_recharge",
    description="Source implementation for Recharge.",
    author="Triplewhale",
    author_email="contact@airbyte.io",
    packages=find_packages(),
    install_requires=MAIN_REQUIREMENTS,
    package_data={"": ["*.json", "schemas/*.json", "schemas/shared/*.json"]},
    extras_require={
        "tests": TEST_REQUIREMENTS,
    },
)
