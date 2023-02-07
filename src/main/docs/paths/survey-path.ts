export const surveyPath = {
  get: {
    tags: ['Enquete'],
    security: [
      { apiKeyAuth: [] }
    ],
    summary: 'Api listar todas as enquetes',
    responses: {
      200: {
        description: 'Sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  },
  post: {
    tags: ['Enquete'],
    security: [
      { apiKeyAuth: [] }
    ],
    summary: 'Api para criar uma enquete',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/addSurveyParams'
        }
      }
    },
    responses: {
      204: {
        description: 'Sucesso'
      },
      403: {
        $ref: '#/components/forbidden'
      },
      404: {
        $ref: '#/components/notFound'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
