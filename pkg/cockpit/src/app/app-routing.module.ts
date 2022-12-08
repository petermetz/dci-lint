import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    redirectTo: "git-repo-linter",
    pathMatch: "full",
  },
  {
    path: "git-repo-linter",
    loadChildren: () =>
      import("./lint-git-repo/lint-git-repo.module").then(
        (m) => m.LintGitRepoPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
