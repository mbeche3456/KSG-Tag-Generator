-- ============================================================
-- Seed super admins: rollstechsolutions@gmail.com, admin@ksg.go.ke, ksg@embu.com
-- Run in Supabase Dashboard → SQL Editor (after schema.sql)
-- ============================================================

create extension if not exists pgcrypto;

-- If user already exists: confirm email + set superadmin role
update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
    || '{"full_name":"Rolls Tech Solutions","role":"superadmin"}'::jsonb
where email = 'rollstechsolutions@gmail.com';

update public.profiles
set
  full_name = 'Rolls Tech Solutions',
  role = 'superadmin'
where email = 'rollstechsolutions@gmail.com';

-- admin@ksg.go.ke
update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
    || '{"full_name":"KSG Admin","role":"superadmin"}'::jsonb
where email = 'admin@ksg.go.ke';

update public.profiles
set
  full_name = 'KSG Admin',
  role = 'superadmin'
where email = 'admin@ksg.go.ke';

-- ksg@embu.com
update auth.users
set
  email_confirmed_at = coalesce(email_confirmed_at, now()),
  raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb)
    || '{"full_name":"EMBU Campus Admin","role":"superadmin"}'::jsonb
where email = 'ksg@embu.com';

update public.profiles
set
  full_name = 'EMBU Campus Admin',
  role = 'superadmin'
where email = 'ksg@embu.com';

-- If user does NOT exist yet, create confirmed account
do $$
declare
  v_user_id uuid;
  v_email text := 'rollstechsolutions@gmail.com';
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt('7mbeche#', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Rolls Tech Solutions","role":"superadmin"}'::jsonb,
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_email,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    insert into public.profiles (id, email, full_name, role)
    values (v_user_id, v_email, 'Rolls Tech Solutions', 'superadmin')
    on conflict (id) do update
      set role = 'superadmin', full_name = 'Rolls Tech Solutions';
  end if;
end $$;

-- Create admin@ksg.go.ke if not exists
do $$
declare
  v_user_id uuid;
  v_email text := 'admin@ksg.go.ke';
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"KSG Admin","role":"superadmin"}'::jsonb,
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_email,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    insert into public.profiles (id, email, full_name, role)
    values (v_user_id, v_email, 'KSG Admin', 'superadmin')
    on conflict (id) do update
      set role = 'superadmin', full_name = 'KSG Admin';
  end if;
end $$;

-- Create ksg@embu.com if not exists
do $$
declare
  v_user_id uuid;
  v_email text := 'ksg@embu.com';
begin
  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) values (
      v_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      v_email,
      crypt('embu', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"EMBU Campus Admin","role":"superadmin"}'::jsonb,
      now(),
      now()
    );

    insert into auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) values (
      gen_random_uuid(),
      v_user_id,
      v_email,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email',
      now(),
      now(),
      now()
    );

    insert into public.profiles (id, email, full_name, role)
    values (v_user_id, v_email, 'EMBU Campus Admin', 'superadmin')
    on conflict (id) do update
      set role = 'superadmin', full_name = 'EMBU Campus Admin';
  end if;
end $$;
