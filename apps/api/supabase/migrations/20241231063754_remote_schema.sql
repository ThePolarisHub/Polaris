CREATE TRIGGER on_auth_users_change AFTER INSERT OR UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_auth_user_changes();


create policy "Allow users to delete their own avatar"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "Allow users to insert their own avatar"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "Allow users to update their own avatar"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));


create policy "Allow users to view their own avatar"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'avatars'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



