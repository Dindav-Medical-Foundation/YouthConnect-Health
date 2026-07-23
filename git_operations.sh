#!/bin/bash
set -e

cd /home/darwin/projects/YouthConnect
git config user.email "darwin@example.com"
git config user.name "Darwin"

git add apps/youthconnect-mobile/package.json apps/youthconnect-mobile/package-lock.json
git checkout -b chore-update-dependencies
git commit -m "chore: update dependencies in mobile app"
git checkout main
git merge --squash chore-update-dependencies
git commit -m "chore: update dependencies in mobile app"
git branch -D chore-update-dependencies

git add apps/youthconnect-mobile/src/screens/HomeScreen.js apps/youthconnect-mobile/app.json apps/youthconnect-mobile/assets/icon.png
git checkout -b fix-ui-wrapping
git commit -m "fix: resolve label wrapping and update app branding"
git checkout main
git merge --squash fix-ui-wrapping
git commit -m "fix: resolve label wrapping and update app branding"
git branch -D fix-ui-wrapping

git add apps/youthconnect-mobile/src/screens/FindClinicScreen.js
git checkout -b fix-find-clinic-crash
git commit -m "fix: prevent MapView crash on Android when API key is missing"
git checkout main
git merge --squash fix-find-clinic-crash
git commit -m "fix: prevent MapView crash on Android when API key is missing"
git branch -D fix-find-clinic-crash

git add apps/youthconnect-mobile/src/screens/LearnSRHScreen.js apps/youthconnect-mobile/src/screens/ModuleDetailScreen.js apps/youthconnect-mobile/src/navigation/AppNavigator.js
git checkout -b feat-interactive-learning
git commit -m "feat: add dedicated detailed content screen for SRH modules"
git checkout main
git merge --squash feat-interactive-learning
git commit -m "feat: add dedicated detailed content screen for SRH modules"
git branch -D feat-interactive-learning

git add README.md
git checkout -b update-readme
git commit -m "docs: overhaul README with clean architecture diagram and setup commands"
git checkout main
git merge --squash update-readme
git commit -m "docs: overhaul README with clean architecture diagram and setup commands"
git branch -D update-readme

git add apps/youthconnect-mobile/tests/app.spec.js apps/youthconnect-mobile/playwright.config.ts
git checkout -b fix-playwright-tests
git commit -m "fix: update playwright tests for new UI"
git checkout main
git merge --squash fix-playwright-tests
git commit -m "fix: update playwright tests for new UI"
git branch -D fix-playwright-tests

git push origin main || echo "Push failed or no origin remote, but commits are complete."
