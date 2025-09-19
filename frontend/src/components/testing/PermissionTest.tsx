/**
 * Permission System Test Component
 * Tests all permission functions and components with different dummy users
 * Used to verify the permission system works correctly
 */

'use client'

import React, { useState } from 'react'
import { dummyUsers } from '@/data/dummy/users'
import { useAuth } from '@/shared/contexts'
import { usePermissions } from '@/shared/hooks'
import { RequiresPermission, PermissionGate } from '@/shared/components'

export default function PermissionTest() {
  const { login, logout, user, isLoading } = useAuth()
  const permissions = usePermissions()
  const [testResults, setTestResults] = useState<string[]>([])

  // Test login function
  const loginAsUser = async (username: string) => {
    const success = await login(username, 'password123')
    if (success) {
      addTestResult(`✅ Successfully logged in as: ${username}`)
    } else {
      addTestResult(`❌ Failed to login as: ${username}`)
    }
  }

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`])
  }

  const runPermissionTests = () => {
    if (!user) {
      addTestResult('❌ No user logged in')
      return
    }

    addTestResult(`🧪 Testing permissions for: ${user.firstName} ${user.lastName}`)

    // Test individual permission functions
    const tests = [
      {
        name: 'hasPermission - HR Users Create',
        result: permissions.hasPermission('hr-users-manage', 'create')
      },
      {
        name: 'hasPermission - HR Users Read',
        result: permissions.hasPermission('hr-users-manage', 'read')
      },
      {
        name: 'hasPermission - HR Users Delete',
        result: permissions.hasPermission('hr-users-manage', 'delete')
      },
      {
        name: 'hasAnyPermission - Download PDF or DOCX',
        result: permissions.hasAnyPermission([
          { permissionId: 'files-downloads-download', action: 'pdf' },
          { permissionId: 'files-downloads-download', action: 'docx' }
        ])
      },
      {
        name: 'hasAnyPermission - Download or Super User',
        result: permissions.hasAnyPermission([
          { permissionId: 'files-downloads-download', action: 'pdf' }
        ])
      },
      {
        name: 'hasAllPermissions - HR Read AND Create',
        result: permissions.hasAllPermissions([
          { permissionId: 'hr-users-manage', action: 'read' },
          { permissionId: 'hr-users-manage', action: 'create' }
        ])
      },
      {
        name: 'hasAnyActionForPermission - HR Users',
        result: permissions.hasAnyActionForPermission('hr-users-manage')
      },
      {
        name: 'isSuperUser (using hasPermission)',
        result: permissions.hasPermission('super-user', 'true')
      },
      {
        name: 'hasModuleAccess - HR module',
        result: permissions.hasModuleAccess('hr')
      },
      {
        name: 'hasModuleAccess - Projects module',
        result: permissions.hasModuleAccess('projects')
      },
      {
        name: 'hasSectionAccess - HR Users section',
        result: permissions.hasSectionAccess('hr-users')
      },
      {
        name: 'hasSectionAccess - HR Schedules section',
        result: permissions.hasSectionAccess('hr-schedules')
      }
    ]

    tests.forEach(test => {
      const status = test.result ? '✅' : '❌'
      addTestResult(`${status} ${test.name}: ${test.result}`)
    })

    // Test getUserActionsForPermission
    const hrActions = permissions.getUserActionsForPermission('hr-users-manage')
    const downloadActions = permissions.getUserActionsForPermission('files-downloads-download')
    addTestResult(`📋 HR actions: [${hrActions.join(', ')}]`)
    addTestResult(`📋 Download actions: [${downloadActions.join(', ')}]`)
  }

  const clearResults = () => {
    setTestResults([])
  }

  if (isLoading) {
    return <div className="p-4">Loading authentication...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Permission System Testing</h1>

      {/* Current User Info */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded">
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">Current User:</h2>
        {user ? (
          <div className="text-gray-800 dark:text-gray-200">
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Permissions:</strong></p>
            <ul className="ml-4">
              {user.permissions.map((perm, index) => (
                <li key={index}>
                  {perm.permissionId}: [{perm.actions.join(', ')}]
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Not logged in</p>
        )}
      </div>

      {/* Test Users Login */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Test Users:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {dummyUsers.map(testUser => (
            <button
              key={testUser.id}
              onClick={() => loginAsUser(testUser.username)}
              className="p-3 text-left bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors border border-gray-200 dark:border-gray-700"
            >
              <div className="font-medium text-gray-900 dark:text-white">{testUser.firstName} {testUser.lastName}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{testUser.username}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500">
                {testUser.permissions.length} permission(s)
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Permission Component Tests */}
      <div className="mb-6">
        <h2 className="font-semibold mb-3 text-gray-900 dark:text-white">Permission Component Tests:</h2>
        <div className="space-y-3">

          {/* RequiresPermission tests */}
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">RequiresPermission Components:</h3>

            <RequiresPermission permissionId="hr-users-manage" action="create">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded mb-2">
                ✅ Create User Button (hr-users-manage + create)
              </div>
            </RequiresPermission>

            <RequiresPermission
              anyOf={[
                { permissionId: 'files-downloads-download', action: 'pdf' },
                { permissionId: 'files-downloads-download', action: 'docx' },
                { permissionId: 'super-user', action: 'true' }
              ]}
            >
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded mb-2">
                ✅ Download Button (PDF or DOCX or Super User)
              </div>
            </RequiresPermission>

            <RequiresPermission requireSuperUser>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded mb-2">
                ✅ Super User Only Content
              </div>
            </RequiresPermission>

            <RequiresPermission
              permissionId="non-existent"
              action="impossible"
              fallback={
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded mb-2">
                  ❌ No Permission Fallback (should always show)
                </div>
              }
            >
              <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded mb-2">
                This should never be visible (exept super suer)
              </div>
            </RequiresPermission>
          </div>

          {/* PermissionGate tests */}
          <div className="p-3 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800">
            <h3 className="font-medium mb-2 text-gray-900 dark:text-white">PermissionGate Components:</h3>

            <PermissionGate permissionId="hr-users-manage" action="read">
              {({ hasAccess }) => (
                <div className={`p-2 rounded mb-2 ${
                  hasAccess
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                }`}>
                  {hasAccess ? '✅' : '❌'} HR Users Read Access: {hasAccess.toString()}
                </div>
              )}
            </PermissionGate>

            <PermissionGate>
              {({ permissions: p }) => (
                <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200">
                  <div>🔍 Permission Analysis:</div>
                  <div className="text-sm">
                    - Can create HR users: {p.hasPermission('hr-users-manage', 'create').toString()}
                  </div>
                  <div className="text-sm">
                    - Can download files: {p.hasAnyPermission([
                      { permissionId: 'download-permission', action: 'pdf' }
                    ]).toString()}
                  </div>
                  <div className="text-sm">
                    - Is super user: {p.hasPermission('super-user', 'true').toString()}
                  </div>
                </div>
              )}
            </PermissionGate>
          </div>
        </div>
      </div>

      {/* Manual Testing */}
      <div className="mb-6">
        <div className="flex gap-3 mb-3">
          <button
            onClick={runPermissionTests}
            disabled={!user}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 hover:bg-blue-600"
          >
            Run Permission Tests
          </button>
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Results
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Test Results:</h3>
            <div className="space-y-1 font-mono text-sm max-h-96 overflow-y-auto text-gray-800 dark:text-gray-200">
              {testResults.map((result, index) => (
                <div key={index} className="whitespace-pre-line">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}