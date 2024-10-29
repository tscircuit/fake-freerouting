# fake-freerouting

Official Docs: https://github.com/freerouting/freerouting/blob/master/docs/API_v1.md

This is a fake implementation of the freerouting api that
uses the tscircuit autorouter. The purpose of this fake is to
enable testing of the freerouting API without having to run
docker containers.

Fakes emulate all the behavior of the real api, including
bugs and errors.

Production requests for typical "happy paths" are recorded
and written to [markdown files here](./scripts/prod-request-recordings)
