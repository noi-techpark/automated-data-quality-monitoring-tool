CREATE table catchsolve_noiodh.custom_dashboards (
    id bigserial not null unique,
    user_id text not null,
    user_role text not null,
    name text not null,
    test_definition_json text not null
)
